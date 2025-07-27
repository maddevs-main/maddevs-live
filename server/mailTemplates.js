// Centralized mail templates for all mail types
// Each function returns a formatted HTML string for use in nodemailer

const BASE_URL = 'https://yourdomain.com'; // TODO: Set to your real deployed domain
const LOGO_URL = BASE_URL + '/assets/media/logo.png';
const MAIL_TOP_URL = BASE_URL + '/assets/media/mail-top.png';

function meetingCredentialsTable(data, showMeetingLink = true) {
  const safe = (v) => v ? String(v) : '-';
  return `
    <table style="width:100%; border-collapse:collapse; font-family: sans-serif; font-size:15px; color:#222; margin-top:12px;">
      <tr style="background:#eee; color:#111; font-weight:bold;">
        <td style="padding:6px 8px;">Meeting Details</td>
        <td style="padding:6px 8px;"> </td>
      </tr>
      <tr><td style="padding:4px 8px;">Name</td><td style="padding:4px 8px;">${safe(data.name)}</td></tr>
      <tr><td style="padding:4px 8px;">Email</td><td style="padding:4px 8px;">${safe(data.email)}</td></tr>
      <tr><td style="padding:4px 8px;">Organisation</td><td style="padding:4px 8px;">${safe(data.organisation)}</td></tr>
      <tr><td style="padding:4px 8px;">Title</td><td style="padding:4px 8px;">${safe(data.title)}</td></tr>
      <tr><td style="padding:4px 8px;">Message</td><td style="padding:4px 8px;">${safe(data.message)}</td></tr>
      <tr><td style="padding:4px 8px;">Date</td><td style="padding:4px 8px;">${safe(data.date)}</td></tr>
      <tr><td style="padding:4px 8px;">Time</td><td style="padding:4px 8px;">${safe(data.time)}</td></tr>
      <tr><td style="padding:4px 8px;">Meeting ID</td><td style="padding:4px 8px;">${safe(data.meetingId)}</td></tr>
      ${showMeetingLink ? `<tr><td style="padding:4px 8px;">Meeting Link</td><td style="padding:4px 8px;">${data.meeting_link ? `<a href='${data.meeting_link}' style='color:#0a112f;text-decoration:underline;'>${safe(data.meeting_link)}</a>` : '-'}</td></tr>` : ''}
    </table>
  `;
}

function footer() {
  return `
    <tr>
      <td colspan="2" style="background:#111; color:#fff; padding:18px 12px; text-align:center; font-size:13px; font-family:sans-serif;">
        maddevs.in &nbsp;|&nbsp; mail@maddevs.in &nbsp;|&nbsp; +91 9211918520
      </td>
    </tr>
  `;
}

function mailTemplate({ subject, intro, meetingData, extraContent, showMeetingLink = true }) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F3EB; font-family:sans-serif; max-width:600px; margin:auto; border-radius:0; overflow:hidden;">
      <tr>
        <td style="padding:0;">
          <img src="${MAIL_TOP_URL}" alt="Mail Header" style="width:100%; display:block; max-width:600px; height:auto; margin:0; padding:0; border:none;" />
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:none; background:transparent;">
            <tr>
              <td style="padding:32px 24px 16px 24px; vertical-align:top;">
                <h2 style="margin:0 0 12px 0; color:#111; font-size:22px; font-weight:700; font-family:sans-serif;">${subject}</h2>
                <p style="margin:0 0 18px 0; color:#222; font-size:16px;">${intro}</p>
                ${meetingCredentialsTable(meetingData, showMeetingLink)}
                ${extraContent ? `<div style='margin-top:18px;'>${extraContent}</div>` : ''}
              </td>
              <td style="padding:24px 24px 0 0; text-align:right; vertical-align:top; width:1px;">
                <img src="${LOGO_URL}" alt="Logo" style="width:64px; height:auto; display:block; margin-left:auto;" />
              </td>
            </tr>
          </table>
        </td>
      </tr>
      ${footer()}
    </table>
  `;
}

function getOnboardCongratsMailHTML(data) {
  return mailTemplate({
    subject: 'Welcome to MadDevs',
    intro: `Dear ${data.name || 'User'},<br><br>We are pleased to confirm your onboarding. Please find your meeting details below.<br><br>We look forward to working with you.<br>Best regards,<br>MadDevs Team`,
    meetingData: data,
    showMeetingLink: true
  });
}

function getMeetingRequestMailHTML(data) {
  return mailTemplate({
    subject: 'New Meeting Request Received',
    intro: `A new onboarding meeting request has been submitted. Please review the details below.<br><br>Please respond at your earliest convenience.`,
    meetingData: data,
    showMeetingLink: false
  });
}

function getOnboardConfirmedMailHTML(data, gcal, ical) {
  return mailTemplate({
    subject: 'Meeting Confirmed',
    intro: `Dear ${data.name || 'User'},<br><br>Your onboarding meeting is confirmed. Please find the details below and add the event to your calendar.<br><br>Looking forward to meeting you.<br>MadDevs Team`,
    meetingData: data,
    extraContent: `<span style='font-size:15px;'>Add to calendar:</span><br>
      <a href="${gcal}" style="color:#0a112f; text-decoration:underline;">Google Calendar</a> &nbsp;|&nbsp;
      <a href="${ical}" download="meeting.ics" style="color:#0a112f; text-decoration:underline;">Apple Calendar (ICS)</a>`,
    showMeetingLink: true
  });
}

function getOnboardRejectedMailHTML(data) {
  return mailTemplate({
    subject: 'Meeting Request Rejected',
    intro: `Dear ${data.name || 'User'},<br><br>We regret to inform you that your onboarding meeting request was not approved. Please contact us for further information.<br><br>Best regards,<br>MadDevs Team`,
    meetingData: data,
    showMeetingLink: true
  });
}

function getOnboardDoneMailHTML(data) {
  return mailTemplate({
    subject: 'Meeting Completed',
    intro: `Dear ${data.name || 'User'},<br><br>Your onboarding meeting has been marked as completed. Thank you for your participation.<br><br>Best regards,<br>MadDevs Team`,
    meetingData: data,
    showMeetingLink: true
  });
}

function getMeetingStatusMailHTML(data, status) {
  return mailTemplate({
    subject: `Meeting Status: ${status}`,
    intro: `The following meeting has been updated to status: <b>${status}</b>.<br><br>Best regards,<br>MadDevs Team`,
    meetingData: data,
    showMeetingLink: true
  });
}

module.exports = {
  getOnboardCongratsMailHTML,
  getMeetingRequestMailHTML,
  getOnboardConfirmedMailHTML,
  getOnboardRejectedMailHTML,
  getOnboardDoneMailHTML,
  getMeetingStatusMailHTML,
}; 