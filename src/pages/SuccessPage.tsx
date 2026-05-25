import { useEffect, useState } from 'react';
import { CheckCircle, Mail, ArrowLeft } from 'lucide-react';

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get('session_id'));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0c0c10',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'sans-serif',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: '#14141c',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        padding: '40px 28px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          background: 'rgba(110,231,183,0.12)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <CheckCircle size={36} color="#6ee7b7" />
        </div>

        <h1 style={{
          fontSize: '24px',
          fontWeight: '800',
          color: '#f1f5f9',
          margin: '0 0 8px',
        }}>
          Paiement confirmé ! 🎉
        </h1>

        <p style={{
          fontSize: '14px',
          color: '#64748b',
          lineHeight: '1.6',
          margin: '0 0 28px',
        }}>
          Merci pour votre achat. Votre template vous a été envoyé par email. 
          Vérifiez votre boîte de réception (et vos spams si besoin).
        </p>

        <div style={{
          background: '#1c1c28',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textAlign: 'left',
        }}>
          <Mail size={20} color="#6ee7b7" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9', marginBottom: '2px' }}>
              Email envoyé
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Le lien de votre template est dans votre boîte mail
            </div>
          </div>
        </div>

        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '13px',
            color: '#f1f5f9',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          <ArrowLeft size={16} />
          Retour à la boutique
        </a>

        {sessionId && (
          <p style={{ fontSize: '11px', color: '#334155', marginTop: '16px' }}>
            Réf: {sessionId.slice(-8).toUpperCase()}
          </p>
        )}
      </div>
    </div>
  );
}
