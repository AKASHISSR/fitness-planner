import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

function AdminVisitsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      const q = query(collection(db, 'visit_logs'), orderBy('timestamp', 'desc'), limit(100));
      const snap = await getDocs(q);
      setLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
    fetchLogs();
  }, []);

  return (
    <div>
      <h2 style={{marginBottom:16}}>История заходов (последние 100)</h2>
      {loading ? <div>Загрузка...</div> : (
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th style={{padding:8, borderBottom:'1px solid #ccc'}}>Время</th>
                <th style={{padding:8, borderBottom:'1px solid #ccc'}}>Email</th>
                <th style={{padding:8, borderBottom:'1px solid #ccc'}}>IP</th>
                <th style={{padding:8, borderBottom:'1px solid #ccc'}}>User-Agent</th>
                <th style={{padding:8, borderBottom:'1px solid #ccc'}}>Страница</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td style={{padding:8, borderBottom:'1px solid #eee'}}>{log.timestamp ? new Date(log.timestamp.seconds*1000).toLocaleString() : ''}</td>
                  <td style={{padding:8, borderBottom:'1px solid #eee'}}>{log.email || '-'}</td>
                  <td style={{padding:8, borderBottom:'1px solid #eee'}}>{log.ip || '-'}</td>
                  <td style={{padding:8, borderBottom:'1px solid #eee', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{log.userAgent || '-'}</td>
                  <td style={{padding:8, borderBottom:'1px solid #eee'}}>{log.page || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminVisitsPage; 