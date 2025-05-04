import { useState, useEffect } from 'react';
import { fetchDocumentation, deleteDocumentation } from '../services/api';

function ManageDocumentation() {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    loadDocumentation();
  }, []);

  const loadDocumentation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedDocs = await fetchDocumentation();
      setDocs(fetchedDocs);
      
      console.log(`Loaded ${fetchedDocs.length} documentation items`);
    } catch (err) {
      console.error('Error loading documentation:', err);
      setError('Failed to load documentation. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    
    try {
      setIsLoading(true);
      setDeleteStatus({ type: '', message: '' });
      
      await deleteDocumentation(id);
      
      // Remove the deleted doc from the state
      setDocs(docs.filter(doc => doc.id !== id));
      
      setDeleteStatus({
        type: 'success',
        message: `Documentation "${title}" deleted successfully!`
      });
      
      // Clear the status message after 3 seconds
      setTimeout(() => {
        setDeleteStatus({ type: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error deleting documentation:', error);
      setDeleteStatus({
        type: 'error',
        message: error.message || 'Failed to delete documentation. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && docs.length === 0) {
    return <div className="loading">Loading documentation...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (docs.length === 0) {
    return <div className="no-docs">No documentation available.</div>;
  }

  return (
    <div className="manage-documentation">
      <h2>Manage Documentation</h2>
      
      {deleteStatus.message && (
        <div className={`status-message ${deleteStatus.type}`}>
          {deleteStatus.message}
        </div>
      )}
      
      <div className="docs-list">
        {docs.map(doc => (
          <div key={doc.id} className="doc-item">
            <div className="doc-info">
              <h3>{doc.title}</h3>
              <p className="doc-date">Created: {new Date(doc.created_at).toLocaleString()}</p>
            </div>
            <div className="doc-actions">
              <button 
                className="delete-btn"
                onClick={() => handleDelete(doc.id, doc.title)}
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageDocumentation;
