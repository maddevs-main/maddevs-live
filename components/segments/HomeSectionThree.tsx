'use client';
import React, { useState, useEffect, useCallback } from 'react';

export default function SectionTHREE() {
  return (
    <div className="subsection min-h-screen w-full flex flex-col justify-between bg-[#E9E3DF] text-[#222222] overflow-hidden font-mono lowercase">
      <div className="flex flex-col mt-0 w-full">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal border-t-1 border-[#222222] py-4 px-6 sm:px-8">
          art
        </h2>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal border-t-2 border-[#222222] py-4 px-6 sm:px-8">
          channelisation
        </h2>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal border-t-2 border-b-2 border-[#222222] py-4 px-6 sm:px-8">
          creative
        </h2>
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mt-4 px-6 sm:px-8"></h2>
        <h1 className="text-[5vw] font-regular leading-none break-words flex items-baseline px-6 sm:px-8">
          <span className="text-[10vw] font-black">nature_</span>
          <br></br> of idea
        </h1>
        <br></br>
        <h1 className="text-[5vw] pb-10 font-regular leading-none break-words flex items-baseline px-6 sm:px-8">
          <span className="text-[10vw] font-thin font-serif italic">nurture_</span>
          <br></br>of its expression
        </h1>
      </div>
    </div>
  );
}
