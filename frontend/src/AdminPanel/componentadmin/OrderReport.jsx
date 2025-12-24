import React, { useState, useEffect } from 'react';
import {
    Search,
    CheckCircle,
    Clock,
    XCircle,
    Truck,
    XOctagon,
} from 'lucide-react';
import { getAllOrders } from '../../services/adminorderreport';

// --- Status Helpers ---
const getStatusData = (status, type) => {
    if (type === 'payment') {
        if (status === 'Paid') {
            return { colorClass: 'text-success border-success-subtle', icon: CheckCircle, text: 'Paid' };
        } else {
            return { colorClass: 'text-danger border-danger-subtle', icon: XCircle, text: 'Unpaid' };
        }
    } else { // order status
        switch (status) {
            case 'Delivered':
                return { icon: Truck, colorClass: 'text-success border-success-subtle', text: 'Delivered' };
            case 'Pending':
                return { icon: Clock, colorClass: 'text-warning border-warning-subtle', text: 'Pending' };
            case 'Cancelled':
                return { icon: XOctagon, colorClass: 'text-danger border-danger-subtle', text: 'Cancelled' };
            default:
                return { icon: Clock, colorClass: 'text-secondary border-secondary-subtle', text: 'Processing' };
        }
    }
};

const StatusPill = ({ value, type }) => {
    const statusData = getStatusData(value, type);
    const Icon = statusData.icon;

    return (
        <span className={`d-inline-flex align-items-center justify-content-center px-3 py-1 rounded-pill fw-semibold ${statusData.colorClass}`}>
            <Icon size={14} className="me-1" />
            {statusData.text}
        </span>
    );
};

// --- Main Component ---
export default function OrderReport() {
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const data = await getAllOrders(); // هيرجع مصفوفة الطلبات
            setOrders(data);
            setLoading(false);
        };
        fetchOrders();
    }, []);

    // --- Filtered Orders ---
    const filteredOrders = orders.filter(order => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const orderIdMatch = order.order_number?.toLowerCase().includes(query) || order.orderId?.toLowerCase().includes(query);
        return orderIdMatch;
    });

    return (
        <div className="container py-4" style={{marginTop:"90px"}}>
            <div className="card shadow-sm border-0">
                <div className="card-body p-4">

                    {/* Search bar */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center pb-3 mb-3 border-bottom border-light">
                        <div className="d-flex align-items-center gap-2">
                            <div className="input-group" style={{ width: '250px' }}>
                                <span className="input-group-text bg-white border-end-0">
                                    <Search size={16} color="#6c757d" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Search order report"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Table */}
                    {loading ? (
                        <p>Loading orders...</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th></th>
                                        <th className="py-3 text-muted" style={{ width: '50px' }}>No.</th>
                                        <th className="py-3 text-muted">Order Id</th>
                                        <th className="py-3 text-muted">Date</th>
                                        <th className="py-3 text-muted">Price</th>
                                        <th className="py-3 text-center text-muted">Payment</th>
                                        <th className="py-3 text-center text-muted">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order, index) => (
                                        <tr key={index}>
                                            <td></td>
                                            <td className="text-secondary">{index + 1}</td>
                                            <td className="fw-bold">{order.order_number || order.orderId}</td>
                                            <td className="text-secondary">{new Date(order.order_date).toLocaleDateString()}</td>
                                            <td className="fw-bold text-dark">${order.grand_total?.toFixed(2) || order.price?.toFixed(2)}</td>
                                            <td className="text-center">
                                                <StatusPill value={order.order_status === 'Completed' ? 'Paid' : 'Unpaid'} type="payment" />
                                            </td>
                                            <td className="text-center">
                                                <StatusPill value={order.order_status || 'Processing'} type="order" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
