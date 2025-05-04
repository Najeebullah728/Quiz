import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchDocumentation } from '../services/api';
import * as storageService from '../services/storageService';

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

        console.log('Loading documentation...');

        // Try to fetch documentation from the API (which now has localStorage fallback)
        let fetchedDocs = [];
        try {
          fetchedDocs = await fetchDocumentation();
          console.log(`Received ${fetchedDocs.length} documentation items from API/localStorage`);
        } catch (fetchError) {
          console.error('Error fetching documentation:', fetchError);

          // Direct fallback to localStorage if the API service fails completely
          console.log('Direct fallback to localStorage');
          fetchedDocs = storageService.getDocumentation();
          console.log(`Retrieved ${fetchedDocs.length} documentation items directly from localStorage`);
        }

        if (fetchedDocs.length === 0) {
          console.log('No documentation found, showing empty state');
          setDocs([]);
          setSelectedDoc(null);
          setContent('');
          return;
        }

        setDocs(fetchedDocs);

        // Set the first doc as selected by default
        setSelectedDoc(fetchedDocs[0]);
        setContent(fetchedDocs[0].content);

        console.log(`Selected documentation: "${fetchedDocs[0].title}"`);
      } catch (err) {
        console.error('Error in documentation component:', err);
        setError(`Failed to load documentation: ${err.message}`);

        // Last resort fallback to hardcoded sample data
        console.log('Using hardcoded fallback sample data');
        const sampleDocs = [
          {
            id: 1,
            title: 'Python Strings (Emergency Fallback)',
            content: `# Python Strings\n\nThis is emergency fallback content. The actual documentation could not be loaded.`
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
