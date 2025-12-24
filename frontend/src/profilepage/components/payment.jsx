import React, { useEffect, useState, useContext } from 'react';
import { FaTrashAlt, FaCcMastercard, FaPaypal, FaPlus } from 'react-icons/fa';
import { getpayments } from '../../services/payments/getpaymentsApi';
import { postpayments } from '../../services/payments/postpaymentsApi';
import { deletepayment } from '../../services/payments/delete.payment.Api';
import { Modal, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

const COLORS = {
    primaryGreen: '#20c997',
    cardBg: '#f8f9fa',
    textColor: '#333',
    deleteIconColor: '#dc3545'
};

const styles = {
    pageContainer: { backgroundColor: '#fff', padding: '30px' },
    paymentCard: { backgroundColor: COLORS.cardBg, borderRadius: '15px', padding: '15px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    paymentIcon: { fontSize: '2.5rem', marginRight: '15px', color: COLORS.textColor },
    paypalIcon: { fontSize: '2.5rem', marginRight: '15px', color: '#0070ba' },
    cardDetails: { flexGrow: 1 },
    cardNumber: { fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px', color: COLORS.textColor },
    expiryDate: { fontSize: '0.9rem', color: '#6c757d' },
    deleteButton: { background: 'none', border: 'none', color: COLORS.deleteIconColor, fontSize: '1.5rem', cursor: 'pointer', padding: '0 10px' },
};

// بطاقة الدفع
const PaymentCard = ({ method, onDelete }) => {
    const isPaypal = method.method.toLowerCase() === 'paypal';
    return (
        <div style={styles.paymentCard}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={isPaypal ? styles.paypalIcon : styles.paymentIcon}>
                    {isPaypal ? <FaPaypal /> : <FaCcMastercard />}
                </span>
                <div style={styles.cardDetails}>
                    <div style={styles.cardNumber}>
                        {method.method} {method.last4 || ''}
                    </div>
                    {!isPaypal && <div style={styles.expiryDate}>Exp {method.exp || ''}</div>}
                </div>
            </div>
            <button style={styles.deleteButton} title="Delete Payment Method" onClick={() => onDelete(method.payment_id)}>
                <FaTrashAlt />
            </button>
        </div>
    );
};

export default function Payment() {
    const { token } = useContext(AuthContext);

    const [payments, setPayments] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPayment, setNewPayment] = useState({
        method: 'MasterCard',
        cardholder: '', number: '', exp: '', cvc: ''
    });

    // جلب طرق الدفع عند التحميل
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await getpayments(token);
                if (res.data.success) {
                    setPayments(res.data.data.payments);
                }
            } catch (err) {
                console.error("Error fetching payments:", err);
            }
        };
        fetchPayments();
    }, [token]);

    // إضافة طريقة دفع
    const handleAddPayment = async () => {
        try {
            // تجهيز البيانات للإرسال
            let body = { ...newPayment };
            
            if (newPayment.method === 'MasterCard') { 
                body.payment_name = "MasterCard";

            } else if (newPayment.method === 'PayPal') {
                body.payment_name = "PayPal";
                // حذف حقول البطاقة إذا كانت PayPal لتجنب إرسال بيانات غير ضرورية
                delete body.cardholder;
                delete body.number;
                delete body.exp;
                delete body.cvc;
            }

            console.log("Sending body to API:", body); // راجع الـ Console للتأكد من البيانات

            const res = await postpayments(body, token);
            
            // معالجة حالة النجاح: إذا نجح الطلب (Axios Status 2xx)
            if (res.data.success) {
                setPayments([...payments, res.data.data.payments[0]]); 
                setShowAddModal(false);
                setNewPayment({ method: 'MasterCard', cardholder: '', number: '', exp: '', cvc: '' });
            } else {
                // إذا عاد كود 2xx ولكن success: false في الداتا
                console.error("API returned success status but unsuccessful data:", res.data);
            }
        } catch (err) {
            
            // ⭐️ معالجة الخطأ الذي يظهر رغم نجاح الإضافة (Status Code 4xx/5xx):
            console.error("Axios failed, attempting to refresh data:", err.response ? err.response.data : err.message);
            
            // 1. إغلاق النافذة المنبثقة
            setShowAddModal(false); 
            
            // 2. تحديث قائمة الدفعات (لإظهار الطريقة المضافة)
            const refreshPayments = async () => {
                try {
                    const res = await getpayments(token);
                    if (res.data.success) {
                        setPayments(res.data.data.payments);
                    } else {
                        throw new Error("Failed to refresh payments after API error.");
                    }
                } catch (refreshErr) {
                    console.error("Error refreshing payments after failed post:", refreshErr);
                }
            };
            refreshPayments();
        }
    };

    // حذف طريقة دفع
    const handleDeletePayment = async (paymentId) => {
        try {
            await deletepayment(paymentId, token);
            setPayments(payments.filter(p => p.payment_id !== paymentId));
        } catch (err) {
            console.error("Error deleting payment:", err);
        }
    };

    return (
        <div style={styles.pageContainer}>
            <h2 className="fw-bold mb-4" style={{color:"#69a297"}}>My Payment Methods</h2>

            <div className="payment-methods-list">
                {payments.map(method => (
                    <PaymentCard key={method.payment_id} method={method} onDelete={handleDeletePayment} />
                ))}
            </div>

            <Button className="mt-3 d-flex align-items-center" onClick={() => setShowAddModal(true)} style={{ background:"#69a297", color:"white", border:'#69a297' }}>
                <FaPlus className="me-2" /> Add Payment Method
            </Button>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Payment Method</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Method</Form.Label>
                            <Form.Select value={newPayment.method} onChange={e => setNewPayment({ ...newPayment, method: e.target.value })}>
                                <option value="MasterCard">Credit/Debit Card</option>
                                <option value="PayPal">PayPal</option>
                            </Form.Select>
                        </Form.Group>

                        {newPayment.method === 'MasterCard' && ( 
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cardholder</Form.Label>
                                    <Form.Control type="text" value={newPayment.cardholder} onChange={e => setNewPayment({ ...newPayment, cardholder: e.target.value })} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Card Number</Form.Label>
                                    <Form.Control type="text" value={newPayment.number} onChange={e => setNewPayment({ ...newPayment, number: e.target.value })} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Expiry</Form.Label>
                                    <Form.Control type="date" value={newPayment.exp} onChange={e => setNewPayment({ ...newPayment, exp: e.target.value })} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>CVC</Form.Label>
                                    <Form.Control type="text" value={newPayment.cvc} onChange={e => setNewPayment({ ...newPayment, cvc: e.target.value })} />
                                </Form.Group>
                            </>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                    <Button style={{ background:"#69a297", color:"white", border:'#69a297' }} onClick={handleAddPayment}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}