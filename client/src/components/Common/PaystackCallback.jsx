import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../../config';

const PaystackCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');

    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/orders/paystack-verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ reference, trxref }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          // Payment successful, redirect to home
          navigate('/app');
        } else {
          // Payment failed or pending
          navigate('/app');
        }
      } catch (err) {
        console.error('Verification failed:', err);
        navigate('/app');
      }
    };

    if (reference) {
      verifyPayment();
    } else {
      navigate('/app');
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 20, marginBottom: 10 }}>Verifying Payment...</div>
        <div>Please wait while we confirm your payment.</div>
      </div>
    </div>
  );
};

export default PaystackCallback;
