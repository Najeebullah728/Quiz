import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchDocumentation } from '../services/api';

function Documentation() {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDocumentation = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch documentation from the API
        const fetchedDocs = await fetchDocumentation();

        setDocs(fetchedDocs);

        // Set the first doc as selected by default
        if (fetchedDocs.length > 0) {
          setSelectedDoc(fetchedDocs[0]);
          setContent(fetchedDocs[0].content);
        }
      } catch (err) {
        console.error('Error loading documentation:', err);
        setError('Failed to load documentation. Please try again later.');

        // Fallback to sample data if API fails
        const sampleDocs = [
          {
            id: 1,
            title: 'Python Strings (Sample)',
            content: `# Python Strings\n\nThis is sample content. The actual documentation could not be loaded.`
          }
        ];

        setDocs(sampleDocs);
        setSelectedDoc(sampleDocs[0]);
        setContent(sampleDocs[0].content);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocumentation();
  }, []);

  const handleDocSelect = (doc) => {
    setSelectedDoc(doc);
    setContent(doc.content);
  };

  return (
    <div className="documentation-container">
      {isLoading ? (
        <div className="loading-container">
          <p>Loading documentation...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      ) : (
        <>
          <div className="docs-sidebar">
            <h2>Documentation</h2>
            {docs.length === 0 ? (
              <p className="no-docs-message">No documentation available.</p>
            ) : (
              <ul className="docs-list">
                {docs.map(doc => (
                  <li
                    key={doc.id}
                    className={selectedDoc && selectedDoc.id === doc.id ? 'active' : ''}
                    onClick={() => handleDocSelect(doc)}
                  >
                    {doc.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="docs-content">
            {selectedDoc ? (
              <div className="markdown-content">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <div className="no-doc-selected">
                <p>Select a document from the sidebar to view its content.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Documentation;
