import { useState, useEffect } from 'react';

function MedicalNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const API_KEY = '3292141b0c1c43509334bf21fd37c036';
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?category=health&country=us&pageSize=5&apiKey=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.articles) {
        setArticles(data.articles.slice(0, 5));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        width: '450px',
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: '#666' }}>Loading health news...</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      flex: '1',  
      height: '490px',  
      overflowY: 'auto'
    }}>
      <h3 style={{ 
        color: '#667eea', 
        marginBottom: '20px', 
        fontSize: '1.5rem',
        textAlign: 'center'
      }}>
        📰 Today's Health News
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {articles.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              padding: '15px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e0e0e0';
            }}
          >
            {article.urlToImage && (
              <img 
                src={article.urlToImage} 
                alt={article.title}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  marginBottom: '10px'
                }}
              />
            )}
            <h4 style={{ 
              fontSize: '1rem', 
              marginBottom: '8px',
              color: '#333',
              lineHeight: '1.4'
            }}>
              {article.title}
            </h4>
            <p style={{ 
              fontSize: '0.85rem', 
              color: '#666',
              marginBottom: '8px',
              lineHeight: '1.5'
            }}>
              {article.description?.substring(0, 100)}...
            </p>
            <p style={{ 
              fontSize: '0.75rem', 
              color: '#999',
              fontStyle: 'italic'
            }}>
              {article.source.name} • {formatDate(article.publishedAt)}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default MedicalNews;