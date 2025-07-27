import React, { useEffect, useState } from 'react';

interface Meeting {
  _id: string;
  name: string;
  email: string;
  organisation: string;
  title: string;
  message: string;
  date: string;
  time: string;
  meetingId: string;
  meeting_link?: string; // NEW FIELD
  createdAt: string;
}

const OnboardView: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch('/api/onboard/all');
        console.log('Fetch status:', res.status);
        const text = await res.text();
        console.log('Fetch response text:', text);
        if (!res.ok) throw new Error('Failed to fetch meetings');
        const data = JSON.parse(text);
        setMeetings(data.meetings || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching meetings');
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', background: '#222', color: '#eee', borderRadius: 8, fontFamily: 'Poppins, sans-serif' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>Meeting Requests</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'salmon' }}>{error}</p>}
      {!loading && !error && meetings.length === 0 && <p>No meetings found.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {meetings.map(meeting => (
          <li key={meeting._id} style={{ marginBottom: '2rem', padding: '1rem', background: '#333', borderRadius: 6 }}>
            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{meeting.name} <span style={{ color: '#aaa', fontWeight: 400 }}>({meeting.email})</span></div>
            <div style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><b>Organisation:</b> {meeting.organisation}</div>
            <div style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><b>Title:</b> {meeting.title}</div>
            <div style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><b>Message:</b> {meeting.message}</div>
            <div style={{ fontSize: '0.95rem', margin: '0.2rem 0' }}><b>Date & Time:</b> {meeting.date} at {meeting.time}</div>
            <div style={{ fontSize: '0.9rem', color: '#b6b6b6', marginTop: '0.5rem' }}><b>Meeting ID:</b> {meeting.meetingId}</div>
            {meeting.meeting_link && (
              <div style={{ fontSize: '0.9rem', color: '#b6b6b6', marginTop: '0.5rem' }}>
                <b>Meeting Link:</b> <a href={meeting.meeting_link} target="_blank" rel="noopener noreferrer" style={{ color: '#4a9eff', textDecoration: 'underline' }}>{meeting.meeting_link}</a>
              </div>
            )}
            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>Requested: {new Date(meeting.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnboardView;
