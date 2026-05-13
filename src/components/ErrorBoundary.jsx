import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {

    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary atrapó un error inmanejable en el árbol de React:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          padding: '20px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%'
          }}>
            <div style={{
              background: '#fef2f2',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <AlertTriangle size={40} color="#dc2626" />
            </div>
            <h1 style={{ margin: '0 0 16px', color: '#1e293b', fontSize: '1.5rem', fontWeight: 800 }}>
              ¡Ups! Algo salio mal
            </h1>
            <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '1rem', lineHeight: '1.6' }}>
              El entorno encontró un error inesperado al dibujar la pantalla.
              No te preocupes, tus datos en EcoTips están a salvo en la nube.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#15803d',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
                boxShadow: '0 4px 6px rgba(21, 128, 61, 0.2)'
              }}
              onMouseOver={e => e.target.style.background = '#166534'}
              onMouseOut={e => e.target.style.background = '#15803d'}
            >
              <RefreshCw size={18} /> Recargar Página
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={{ marginTop: '30px', textAlign: 'left', background: '#f1f5f9', padding: '16px', borderRadius: '8px', overflowX: 'auto' }}>
                <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.85rem', fontWeight: 600 }}>[Debug] Error details:</p>
                <code style={{ fontSize: '0.75rem', color: '#334155' }}>{this.state.error.toString()}</code>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
