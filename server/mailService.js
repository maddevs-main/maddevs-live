const nodemailer = require('nodemailer');
const config = require('./config');
const templates = require('./mailTemplates');

const transporter = nodemailer.createTransport(config.mail.smtp);

function getCalendarLinks({ name, email, organisation, title, message, date, time, meetingId }) {
  // Format date/time for calendar links
  // date: YYYY-MM-DD, time: HH:mm
  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour meeting
  function pad(n) { return n < 10 ? '0' + n : n; }
  function formatCalDate(d) {
    return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + '00Z';
  }
  const startStr = formatCalDate(start);
  const endStr = formatCalDate(end);
  const details = encodeURIComponent(`Organisation: ${organisation}\nTitle: ${title}\nMessage: ${message}\nMeeting ID: ${meetingId}`);
  const location = encodeURIComponent('Online');
  const gcal = `https://www.google.com/calendar/render?action=TEMPLATE&text=Onboarding+Meeting+with+${encodeURIComponent(name)}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
  // Proper ICS file content for Apple Calendar
  const ical = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:Onboarding%20Meeting%20with%20${encodeURIComponent(name)}%0ADESCRIPTION:${details}%0ADTSTART:${startStr}%0ADTEND:${endStr}%0ALOCATION:${location}%0AEND:VEVENT%0AEND:VCALENDAR`;
  return { gcal, ical };
}

async function sendOnboardCongratsMail(to, name, formData) {
  const mailOptions = {
    from: config.mail.from,
    to,
    subject: 'Onboard Meeting Request Submitted',
    html: templates.getOnboardCongratsMailHTML({ ...formData, name }),
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Mail send error:', err);
    return false;
  }
}

async function sendMeetingRequestMail(formData) {
  const mailOptions = {
    from: config.mail.from,
    to: config.mail.from, // send to ourselves; change if needed
    subject: `New Onboard Request Received - ${formData.organisation} - ${formData.name}`,
    html: templates.getMeetingRequestMailHTML(formData),
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Mail send error:', err);
    return false;
  }
}

async function sendOnboardConfirmedMail(to, name, formData) {
  const { gcal, ical } = getCalendarLinks(formData);
  const mailOptions = {
    from: config.mail.from,
    to,
    subject: 'Your Meeting is Confirmed!',
    html: templates.getOnboardConfirmedMailHTML({ ...formData, name }, gcal, ical),
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Mail send error:', err);
    return false;
  }
}

async function sendOnboardRejectedMail(to, name, formData) {
  const mailOptions = {
    from: config.mail.from,
    to,
    subject: `Meeting Request Rejected - ${formData.organisation} - ${formData.name}`,
    html: templates.getOnboardRejectedMailHTML({ ...formData, name }),
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Mail send error:', err);
    return false;
  }
}

async function sendOnboardDoneMail(to, name, formData) {
  const mailOptions = {
    from: config.mail.from,
    to,
    subject: `Meeting Completed - ${formData.organisation} - ${formData.name}`,
    html: templates.getOnboardDoneMailHTML({ ...formData, name }),
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Mail send error:', err);
    return false;
  }
}

async function sendMeetingStatusMail(formData, status) {
  const mailOptions = {
    from: config.mail.from,
    to: config.mail.from, // send to ourselves; change if needed
    subject: `Meeting ${status} - ${formData.organisation} - ${formData.name}`,
    html: templates.getMeetingStatusMailHTML(formData, status),
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Mail send error:', err);
    return false;
  }
}

module.exports = {
  sendOnboardCongratsMail,
  sendMeetingRequestMail,
  sendOnboardConfirmedMail,
  sendOnboardRejectedMail,
  sendOnboardDoneMail,
  sendMeetingStatusMail
}; 