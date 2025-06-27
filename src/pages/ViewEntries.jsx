    // src/pages/ViewEntries.jsx
    import { useEffect, useState } from 'react';
    import axios from 'axios';

    export default function ViewEntries() {
    const [entries, setEntries] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchEntries = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/entries', {
            headers: {
                Authorization: `Bearer ${token}`
            }
            });
            setEntries(res.data);
        } catch (err) {
            alert("Failed to load entries.");
        }
        };
        fetchEntries();
    }, []);

    return (
        <div className="pt-4 px-4 overflow-x-auto w-auto mx-auto bg-gray-100 shadow-md rounded min-h-screen">
        <h2 className="text-2xl font-bold mb-4">All Transport Entries</h2>
        <table className="min-w-full text-sm bg-white shadow rounded">
            <thead className="bg-blue-500 text-white">
            <tr>
                <th className="p-2">LR No</th>
                <th className="p-2">Vehicle</th>
                <th className="p-2">Origin</th>
                <th className="p-2">Destination</th>
                <th className="p-2">Freight ₹</th>
                <th className="p-2">Created By</th>
                <th className="p-2">Updated By</th>
            </tr>
            </thead>
            <tbody>
            {entries.map(entry => (
                <tr key={entry.id} className="text-center border-t">
                <td className="p-2">{entry.lrNo}</td>
                <td className="p-2">{entry.vehicleNo}</td>
                <td className="p-2">{entry.origin}</td>
                <td className="p-2">{entry.destination}</td>
                <td className="p-2">{entry.totalFreight}</td>
                <td className="p-2">{entry.creator?.username} ({entry.creator?.role})</td>
                <td className="p-2">{entry.updater?.username || '-'} ({entry.updater?.role || '-'})</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    }
