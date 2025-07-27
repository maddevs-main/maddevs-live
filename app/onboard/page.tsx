"use client"

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import CustomCursor from '@/components/Cursor';
import gsap from 'gsap';
import TextPlugin from 'gsap/TextPlugin';
import { ScrollProgressBar } from '@/components/Scrollbar';

gsap.registerPlugin(TextPlugin);
// Metadata is now in page.metadata.ts (server-only)
export default function OnboardPage() {
  // Refs for the elements to be animated
  const pageWrapperRef = useRef(null);
  const onboardRef = useRef(null);
  const contentParaRef = useRef(null);
  const formWrapperRef = useRef(null);
  
  // State for multi-step form
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [meetingId, setMeetingId] = useState('');

  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organisation: '',
    title: '',
    message: '',
    date: '',
    time: '',
  });

  // State to manage submission status
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });
  
  // Use useLayoutEffect to prevent flash of unstyled content before animation
  useLayoutEffect(() => {
    const allRefs = onboardRef.current && contentParaRef.current && formWrapperRef.current && pageWrapperRef.current;
    if (allRefs) {
      // Set initial states BEFORE making the page visible to prevent flashing
      gsap.set(pageWrapperRef.current, { visibility: 'hidden' });
      gsap.set(onboardRef.current, { text: "" });
      gsap.set(contentParaRef.current, { xPercent: -100, autoAlpha: 0 });
      gsap.set(formWrapperRef.current, { xPercent: 100 }); // Start form off-screen right

      // Now, make the page visible and start animations
      gsap.set(pageWrapperRef.current, { visibility: 'visible' });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.to(onboardRef.current, { duration: 2, text: "onboard", ease: "none" })
        .to(contentParaRef.current, { duration: 1.2, xPercent: 0, autoAlpha: 1 }, "<0.3") // Fade in paragraph
        .to(formWrapperRef.current, { duration: 1.2, xPercent: 0 }, "<"); // Slide in form
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
    
  // Handle time preset selection
  const handleTimeSelect = (time) => {
      setFormData(prev => ({...prev, time: time}));
  };

  // Animate form step transitions
  const handleNextStep = () => {
      const { name, email, organisation, title, message } = formData;
      if (name && email && organisation && title && message) {
          if(!formWrapperRef.current) return;
          gsap.to(formWrapperRef.current, {
              duration: 0.6,
              xPercent: 100,
              ease: "power3.in",
              onComplete: () => setStep(2)
          });
      } else {
        console.log('Validation failed: Please fill out all fields.');
      }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if(!formData.date || !formData.time) return;
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
    try {
      const newMeetingId = `MEETING-${Date.now().toString(36).toUpperCase()}`;
      setMeetingId(newMeetingId);
      // Send data to backend, always seed approved: null
      const response = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, meetingId: newMeetingId, approved: null })
      });
      if (!response.ok) {
        throw new Error('Failed to submit meeting request');
      }
      setStatus({ submitted: true, submitting: false });
      if(!formWrapperRef.current) return;
      gsap.to(formWrapperRef.current, {
          duration: 0.6,
          xPercent: 100,
          ease: "power3.in",
          onComplete: () => setStep(3)
      });
    } catch (error) {
      setStatus({ submitted: false, submitting: false, info: { error: true, msg: error.message || 'Something went wrong.' } });
    }
  };

  // Animate steps sliding in when the `step` state changes
  useEffect(() => {
    if (step > 1 && formWrapperRef.current) {
        gsap.fromTo(formWrapperRef.current, 
            { xPercent: 100 }, 
            { duration: 0.6, xPercent: 0, ease: "power3.out" }
        );
    }
  }, [step]);
  
  // CustomDatePicker component
  const CustomDatePicker = ({ value, onChange }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const datePickerRef = useRef(null);
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const today = new Date();
    today.setHours(0,0,0,0);
    const changeMonth = (amount) => {
      setCurrentMonth(prev => {
        const newMonth = new Date(prev);
        newMonth.setMonth(newMonth.getMonth() + amount);
        return newMonth;
      });
    };
    const generateDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`pad-start-${i}`} className="p-2"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelected = value && new Date(value).toDateString() === date.toDateString();
            const isDisabled = date < today;
            days.push(
                <button key={day} type="button" disabled={isDisabled} onClick={() => { onChange({ target: { name: 'date', value: date.toISOString().split('T')[0] } }); setShowDatePicker(false); }} className={`p-2 w-full text-center text-sm font-mono rounded-none transition-colors duration-200 ${isDisabled ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-600'} ${isSelected ? 'bg-gray-300 text-[#241b1b] font-bold' : ''}`}>
                    {day}
                </button>
            );
        }
        return days;
    };
    useEffect(() => {
        const handleClickOutside = (event) => { if (datePickerRef.current && !datePickerRef.current.contains(event.target)) { setShowDatePicker(false); } };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <div className="relative" ref={datePickerRef}>
            <div className={`${inputClasses} flex items-center justify-between cursor-pointer`} onClick={() => setShowDatePicker(!showDatePicker)}>
                <span>{value || 'Select a date'}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            {showDatePicker && (<div className="absolute top-full left-0 mt-2 w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 p-4 z-10"><div className="flex justify-between items-center mb-4"><button type="button" onClick={() => changeMonth(-1)} className="p-2 text-gray-400 hover:bg-gray-700">&lt;</button><div className="font-mono text-sm text-gray-300 uppercase">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</div><button type="button" onClick={() => changeMonth(1)} className="p-2 text-gray-400 hover:bg-gray-700">&gt;</button></div><div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 font-mono mb-2">{daysOfWeek.map((day, index) => <div key={`${day}-${index}`}>{day}</div>)}</div><div className="grid grid-cols-7 gap-1">{generateDays()}</div></div>)}
        </div>
    )
  }

  // Common class names and data
  const inputClasses = "w-full bg-[transparent] border border-gray-600 text-gray-300 font-mono p-2 rounded-none focus:outline-none focus:border-gray-400 transition-colors duration-300 text-sm";
  const timePresetClasses = (isSelected) => `border font-mono uppercase tracking-wider text-xs rounded-none px-4 py-2 transition-all duration-300 ${isSelected ? 'bg-gray-300 text-gray-800' : 'border-gray-600 text-gray-400 hover:bg-gray-500 hover:text-gray-300'}`;
  const timePresets = ['09:00', '11:00', '14:00', '16:00'];

  return (

    <div ref={pageWrapperRef} className="bg-[#241b1b] min-h-screen w-full flex flex-col justify-center font-sans text-gray-300 overflow-x-hidden" style={{visibility: 'hidden' }}>

      <div className="w-full mt-20">
        {/* SEO: Main headline for the page */}
        {/* TODO: Match this to the title above */}
        {/* SEO: Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage', // TODO: Use a more specific type if possible
              'name': 'meeting onbaord appointment schedule', // TODO: Match this to the title above
              // ...add more fields as needed
            }),
          }}
        />
        <h1 ref={onboardRef} className="text-[19vw] sm:text-[18vw] md:text-[20vw] lg:text-[22vw] font-black text-gray-700 tracking-tighter lowercase relative text-right" style={{ right: '-2vw' }}></h1><br></br>
        <div ref={contentParaRef} className="w-full -mt-2 sm:-mt-4 md:-mt-6 lg:-mt-8 pl-4 sm:pl-6 lg:pl-8">
            <p className="font-mono text-sm sm:text-base max-w-2xl">Our onboarding process is simple, fast and very smooth.

            We start with a virtual meetup, where we dive deep into your project, your goals, your vision—what your dream, your idea feels like, to you and to us. A handshake, and that’s it.

</p>
            <p className="font-mono text-sm sm:text-base mt-2">Welcome aboard.</p>
        </div>
        
        <div className="w-full mt-8 md:mt-12 flex justify-end" style={{paddingBottom: '3rem'}}>
            <div ref={formWrapperRef} className="bg-gray-700/50 backdrop-blur-sm p-6 sm:p-8 w-full max-w-md" >
                <div className="relative" style={{ minHeight: '450px' }}>
                    {/* Step 1: Initial Details */}
                    {step === 1 && (
                        <div className="w-full">
                            <p className="font-mono text-xs sm:text-sm text-left mb-6 text-gray-300">let's get you started</p>
                            <form className="w-full text-left" onSubmit={(e) => e.preventDefault()}>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-1"><label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1">Full Name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className={inputClasses}/></div>
                                <div className="sm:col-span-1"><label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1">Email</label><input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className={inputClasses}/></div>
                                <div className="col-span-1 sm:col-span-2"><label htmlFor="organisation" className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1">Organisation</label><input type="text" id="organisation" name="organisation" value={formData.organisation} onChange={handleInputChange} required className={inputClasses} /></div>
                                <div className="col-span-1 sm:col-span-2"><label htmlFor="title" className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1">Title</label><input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required className={inputClasses} /></div>
                                <div className="col-span-1 sm:col-span-2"><label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1">Message</label><textarea id="message" name="message" rows="3" value={formData.message} onChange={handleInputChange} required className={inputClasses}></textarea></div>
                              </div>
                              <div className="mt-6 flex justify-end"><button type="button" onClick={handleNextStep} className="font-mono uppercase tracking-wider text-gray-300 border border-gray-500 px-6 py-2 text-sm rounded-none hover:bg-gray-300 hover:text-[#241b1b] transition-all duration-300">Next</button></div>
                            </form>
                        </div>
                    )}

                    {/* Step 2: Date and Time */}
                    {step === 2 && (
                        <div className="w-full">
                            <p className="font-mono text-xs sm:text-sm text-left mb-6 text-gray-300">Select a Date & Time</p>
                            <form className="space-y-6" onSubmit={handleFormSubmit}>
                                <div><label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">Date</label><CustomDatePicker value={formData.date} onChange={handleInputChange} /></div>
                                <div><label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">Time</label><div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{timePresets.map(time => <button key={time} type="button" onClick={() => handleTimeSelect(time)} className={timePresetClasses(formData.time === time)}>{time}</button>)}</div><div className="mt-4"><label htmlFor="customTime" className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1">Or a custom time</label><input type="time" id="customTime" name="time" value={formData.time} onChange={handleInputChange} className={`${inputClasses} custom-time-picker`}/></div></div>
                                <div className="pt-2 flex justify-end"><button type="submit" disabled={status.submitting} className="font-mono uppercase tracking-wider text-gray-300 border border-gray-500 px-6 py-2 text-sm rounded-none hover:bg-gray-300 hover:text-[#241b1b] transition-all duration-300 disabled:opacity-50">{status.submitting ? 'Submitting...' : 'Submit'}</button></div>
                            </form>
                        </div>
                    )}
                    
                    {/* Step 3: Confirmation */}
                     {step === 3 && (
                        <div className="w-full flex items-center justify-center" style={{ minHeight: '450px' }}>
                            <div className="text-left p-6 sm:p-8 border border-gray-600 w-full">
                                <h3 className="font-mono text-lg text-gray-300">Thank You, {formData.name.split(' ')[0]}!</h3>
                                <p className="font-mono text-sm text-gray-400 mt-2">Your appointment request has been submitted for approval.</p>
                                <p className="font-mono text-sm text-gray-400 mt-1">Once confirmed, the meeting details will be sent to your email.</p>
                                <div className="border-t border-gray-600 my-4"></div>
                                <h4 className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-3">Request Summary</h4>
                                <div className="font-mono text-sm space-y-2 text-gray-300">
                                    <p><strong>ID:</strong><span className="text-gray-400 ml-2">{meetingId}</span></p>
                                    <p><strong>Organisation:</strong><span className="text-gray-400 ml-2">{formData.organisation}</span></p>
                                    <p><strong>Email:</strong><span className="text-gray-400 ml-2">{formData.email}</span></p>
                                    <p><strong>Project:</strong><span className="text-gray-400 ml-2">{formData.title}</span></p>
                                    <p><strong>Date & Time:</strong><span className="text-gray-400 ml-2">{formData.date} at {formData.time}</span></p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
      <style>{`.custom-time-picker::-webkit-calendar-picker-indicator { filter: invert(0.8) brightness(1); cursor: pointer; }`}</style>
      <ScrollProgressBar />
      <CustomCursor />
    </div>
   
    
  );
}
