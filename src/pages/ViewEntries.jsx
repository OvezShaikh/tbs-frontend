import { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Button,
  Select,
  MenuItem
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ViewEntries() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    creator: '',
    updater: '',
    dateFrom: '',
    dateTo: ''
  });
  const token = localStorage.getItem('token');

  const printRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/entries`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEntries(res.data);
      } catch {
        alert('Failed to load entries.');
      }
    })();
  }, [token]);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    return new Date(year, month - 1, day);
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const entryDate = parseDate(entry.date);
      const fromDate = parseDate(filters.dateFrom);
      const toDate = parseDate(filters.dateTo);

      const dateMatch =
        (!fromDate || entryDate >= fromDate) &&
        (!toDate || entryDate <= toDate);

      const otherFilters =
        (!filters.origin || entry.origin === filters.origin) &&
        (!filters.destination || entry.destination === filters.destination) &&
        (!filters.creator || entry.creator?.username === filters.creator) &&
        (!filters.updater || entry.updater?.username === filters.updater);

      return dateMatch && otherFilters;
    });
  }, [entries, filters]);

  const options = useMemo(() => ({
    origin: [...new Set(entries.map(e => e.origin))],
    destination: [...new Set(entries.map(e => e.destination))],
    creator: [...new Set(entries.map(e => e.creator?.username).filter(Boolean))],
    updater: [...new Set(entries.map(e => e.updater?.username).filter(Boolean))]
  }), [entries]);

  // 🖨️ Print Function
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const myWindow = window.open('', '', 'width=900,height=700');
    myWindow.document.write('<html><head><title>Print Entries</title>');
    myWindow.document.write('<style>table {width: 100%; border-collapse: collapse;} th, td {border: 1px solid #000; padding: 6px; text-align: left;} th {background-color: #f0f0f0;} h2 {text-align: center;}</style>');
    myWindow.document.write('</head><body >');
    myWindow.document.write(printContent);
    myWindow.document.write('</body></html>');
    myWindow.document.close();
    myWindow.focus();
    myWindow.print();
  };

  // 🧾 Download PDF Function
  const handleDownloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Transport Entries Report', 15, 15);

  const tableColumn = [
    'LR No',
    'Vehicle',
    'Origin',
    'Destination',
    'Freight ₹',
    'Date',
    'Created By',
    'Updated By',
  ];

  const tableRows = filteredEntries.map((entry) => [
    entry.lrNo,
    entry.vehicleNo,
    entry.origin,
    entry.destination,
    entry.freightRate,
    entry.date,
    entry.creator ? `${entry.creator.username}` : '—',
    entry.updater ? `${entry.updater.username}` : '—',
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      overflow: 'linebreak', // ✅ wrap text instead of trimming
      cellWidth: 'auto',     // auto adjust width per content
    },
    columnStyles: {
      1: { cellWidth: 'wrap' }, // Vehicle column wraps if text is long
      2: { cellWidth: 'wrap' }, // Origin
      3: { cellWidth: 'wrap' }, // Destination
      // other columns can stay auto
    },
    headStyles: {
      fillColor: [41, 128, 185], // blue header
      textColor: 255,
      fontStyle: 'bold',
    },
    bodyStyles: {
      valign: 'top', // text aligns to top for multi-line cells
    },
    didDrawPage: (data) => {
      // Optional: add page numbers
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.text(`Page ${data.pageNumber} of ${pageCount}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10);
    },
  });

  doc.save('transport_entries.pdf');
};

  // Heading for print section
  const printHeading = () => {
    if (filters.dateFrom && filters.dateTo) return `Entries from ${filters.dateFrom} to ${filters.dateTo}`;
    if (filters.dateFrom) return `Entries from ${filters.dateFrom}`;
    if (filters.dateTo) return `Entries up to ${filters.dateTo}`;
    return 'All Entries';
  };

  return (
    <>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1400, bgcolor: '#fff' }}>
        <Navbar />
      </Box>

      <Box sx={{ p: 6, mx: 'auto', maxWidth: 1240 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          All Transport Entries
        </Typography>

        {/* Filter Buttons */}
        <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                setFilters({ origin: '', destination: '', creator: '', updater: '', dateFrom: '', dateTo: '' })
              }
            >
              Clear Filters
            </Button>
            <Button variant="contained" size="small" color="primary" onClick={handlePrint}>
              Print
            </Button>
            <Button variant="contained" size="small" color="secondary" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </Box>
        </Paper>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          {['origin', 'destination', 'creator', 'updater'].map(f => (
            <Select
              key={f}
              value={filters[f]}
              onChange={e => setFilters(prev => ({ ...prev, [f]: e.target.value }))}
              displayEmpty
              size="small"
            >
              <MenuItem value="">All {f}</MenuItem>
              {options[f].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
          ))}

          <TextField
            label="From Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filters.dateFrom}
            onChange={e => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
          />
          <TextField
            label="To Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filters.dateTo}
            onChange={e => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
          />
        </Box>

        {/* Entries Table */}
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                {['LR No', 'Vehicle', 'Origin', 'Destination', 'Freight ₹', 'Date', 'Created By', 'Updated By', 'Action'].map(head => (
                  <TableCell key={head} sx={{ color: 'white', fontWeight: 'bold' }}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEntries.map(entry => (
                <TableRow hover key={entry.id}>
                  <TableCell>{entry.lrNo}</TableCell>
                  <TableCell>{entry.vehicleNo}</TableCell>
                  <TableCell>{entry.origin}</TableCell>
                  <TableCell>{entry.destination}</TableCell>
                  <TableCell>{entry.freightRate}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.creator ? `${entry.creator.id} - ${entry.creator.username}` : '—'}</TableCell>
                  <TableCell>{entry.updater ? `${entry.updater.id} - ${entry.updater.username}` : '—'}</TableCell>
                  <TableCell>
                    <Button component={Link} to={`/update/${entry.id}`} variant="outlined" size="small">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Printable Section (Hidden) */}
        <div ref={printRef} style={{ display: 'none' }}>
          <h2>{printHeading()}</h2>
          <table>
            <thead>
              <tr>
                <th>LR No</th>
                <th>Vehicle</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Freight ₹</th>
                <th>Date</th>
                <th>Created By</th>
                <th>Updated By</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.lrNo}</td>
                  <td>{entry.vehicleNo}</td>
                  <td>{entry.origin}</td>
                  <td>{entry.destination}</td>
                  <td>{entry.freightRate}</td>
                  <td>{entry.date}</td>
                  <td>{entry.creator ? `${entry.creator.id} - ${entry.creator.username}` : '—'}</td>
                  <td>{entry.updater ? `${entry.updater.id} - ${entry.updater.username}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          component="div"
          count={filteredEntries.length}
          page={0}
          rowsPerPage={10}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>
    </>
  );
}
