import { useEffect, useState } from 'react';
import './AdminFeedbackPage.css';

function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('fitgenius_feedback') || '[]');
    setFeedback(data.reverse());
  }, []);

  const removeFeedback = idx => {
    const newFeedback = feedback.filter((_, i) => i !== idx);
    setFeedback(newFeedback);
    // Сохраняем в localStorage в обратном порядке (чтобы новые были в конце, как раньше)
    localStorage.setItem('fitgenius_feedback', JSON.stringify([...newFeedback].reverse()));
  };

  return (
    <div className="admin-feedback-root">
      <h1>Обращения с формы обратной связи</h1>
      {feedback.length === 0 ? (
        <div className="admin-feedback-empty">Пока нет ни одного обращения.</div>
      ) : (
        <table className="admin-feedback-table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Сообщение</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((f, i) => (
              <tr key={i}>
                <td>{f.date}</td>
                <td>{f.name}</td>
                <td><a href={`mailto:${f.email}`}>{f.email}</a></td>
                <td>{f.message}</td>
                <td><button className="admin-feedback-remove-btn" onClick={() => removeFeedback(i)}>Удалить</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminFeedbackPage; 