import React, { useLayoutEffect, useRef, forwardRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styled, { createGlobalStyle } from 'styled-components';

gsap.registerPlugin(ScrollTrigger);

// --- HELPER COMPONENTS & UTILS ---

const placeholderImage = (text: string) => `https://placehold.co/1920x1080/111827/ffffff?text=${text}`;

const WordWrapper = styled.span`
  display: inline-block;
  overflow: hidden;
  margin-right: 0.25em;
`;

const WordInner = styled.span`
  display: inline-block;
  transform: translateY(110%);
`;

interface SplitHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string;
  $fontSize?: string;
  $fontFamily?: string;
  $fontWeight?: string;
  $textTransform?: string;
  $letterSpacing?: string;
  $textAlign?: string;
  $padding?: string;
  $whiteSpace?: string;
  $lineHeight?: number | string;
  $margin?: string | number;
}
const SplitHeading = forwardRef<HTMLHeadingElement, SplitHeadingProps>(({ text, ...props }, ref) => (
  <Heading ref={ref} {...props}>
    {text.split(' ').map((word: string, index: number, arr: string[]) => (
      <React.Fragment key={index}>
        <WordWrapper>
          <WordInner className="heading-word">{word}</WordInner>
        </WordWrapper>
        {index < arr.length - 1 && ' '}
      </React.Fragment>
    ))}
  </Heading>
));
SplitHeading.displayName = 'SplitHeading';

// --- STYLED COMPONENTS ---

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:wght@700&display=swap');
  
  body {
    background-color: #111;
    overscroll-behavior: none;
  }
`;

const ComponentWrapper = styled.div`
  position: relative;
`;

const PinWrapper = styled.div<{ sections: number }>`
  position: relative;
  height: ${props => props.sections * 150}vh;
`;

const SliderContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden; 
  background: #111;
`;

const Section = styled.section`
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
  background-color: #111; /* Robustness: prevents any transparent flashes */
`;

const Background = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  padding-left: 4vw;
  box-sizing: border-box;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-position: center;
  scale: 1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%);
`;

interface HeadingProps {
  $fontSize?: string;
  $fontFamily?: string;
  $fontWeight?: string;
  $textTransform?: string;
  $letterSpacing?: string;
  $textAlign?: string;
  $padding?: string;
  $whiteSpace?: string;
  $lineHeight?: number | string;
  $margin?: string | number;
}
const Heading = styled.h1<HeadingProps>`
  font-size: ${props => props.$fontSize || 'clamp(2.5rem, 8vw, 8rem)'};
  font-family: ${props => props.$fontFamily || "'Bebas Neue', 'Inter', sans-serif"};
  font-weight: ${props => props.$fontWeight || 'normal'};
  text-transform: ${props => props.$textTransform || 'uppercase'};
  letter-spacing: ${props => props.$letterSpacing || '0.1em'};
  text-align: ${props => props.$textAlign || 'left'};
  position: relative;
  color: white;
  margin-bottom: 20px;
  padding: ${props => props.$padding || '0 5vw'};
  white-space: ${props => props.$whiteSpace || 'normal'};
  line-height: ${props => props.$lineHeight || 1.05};
  margin: ${props => props.$margin || '0'};
  width: 100%;
  max-width: 100vw;
  overflow-wrap: break-word;
  word-break: break-word;
  overflow: hidden;
`;

const InfoBox = styled.div`
  position: relative;
  width: clamp(300px, 50vw, 600px);
  padding: 2rem;
  background: rgba(0, 0, 0, 0.43);
  border: 0px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  backdrop-filter: blur(15px) saturate(1.8);
  -webkit-backdrop-filter: blur(12px) saturate(1.8);
  text-align: start;
  color:rgb(215, 215, 215);
  opacity: 0;
`;

const InfoParagraph = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  line-height: 1.6;
  font-weight: 700;
  margin: 0;
`;

// --- MAIN COMPONENT ---

const AdvancedSlider = () => {
    const componentRef = useRef(null);
    const pinWrapperRef = useRef(null);
    const sliderContainerRef = useRef(null);
    const sectionRefs = useRef<any[]>([]);
    const bgRefs = useRef<any[]>([]);
    const headingRefs = useRef<any[]>([]);
    const infoBoxRef = useRef(null);

    const sections = [
        { text: "DESIGN THE LIGHTS, PIXELS", imageUrl: "./public/assets/media/pixels.jpg", headingStyle: { $fontSize: 'clamp(8rem, 22vw, 32rem)', $fontFamily: "'Bebas Neue', sans-serif", $textTransform: 'lowercase', $textAlign: 'left', $whiteSpace: 'normal', $lineHeight: 1.05, $letterSpacing: '0.01em', $padding: '0 2vw', $marginBottom: 100 }},
        { text: "like dusk, like dawn", imageUrl: "https://cbx-prod.b-cdn.net/COLOURBOX64002499.jpg?width=800&height=800&quality=70", headingStyle: { $fontSize: 'clamp(3rem, 7vw, 7rem)', $fontFamily: "'Cormorant Garamond', serif", $textTransform: 'none', $fontWeight: '700' }},
        { text: "or midnight", imageUrl: "https://static.vecteezy.com/system/resources/previews/003/711/473/large_2x/rough-stone-texture-photo.jpg", headingStyle: { $fontSize: 'clamp(2.5rem, 6vw, 6rem)', $fontFamily: "'Bebas Neue', sans-serif", $textTransform: 'uppercase' }, paragraph: "We create seamless, intuitive user journeys that feel both natural and delightful. Our focus is on crafting digital interactions that are not only functional but also emotionally resonant, guiding the user effortlessly towards their goal."}
    ];

    useLayoutEffect(() => {
        const setupAnimations = () => {
            // --- Set initial states for all sections ---
            sectionRefs.current.forEach((section, i) => {
                gsap.set(section, {
                    zIndex: i,
                    yPercent: i > 0 ? 100 : 0,
                    autoAlpha: 1, // Keep all sections technically visible but positioned off-screen
                });
            });

            // Animate the first section's content into view on load
            if (headingRefs.current[0]) {
              gsap.to((headingRefs.current[0] as HTMLElement).querySelectorAll('.heading-word'), {
                y: 0,
                stagger: 0.05,
                ease: "power3.out",
                duration: 1,
              });
            }
            if (bgRefs.current[0]) {
              gsap.to((bgRefs.current[0] as HTMLElement).querySelector('img'), {
                scale: 1,
                ease: "power1.inOut",
                duration: 1.5
              });
            }

            const masterTl = gsap.timeline({
                scrollTrigger: {
                    trigger: pinWrapperRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    pin: sliderContainerRef.current,
                    scrub: 1,
                    snap: {
                        snapTo: "labels",
                        duration: 0.4,
                        delay: 0.05,
                        ease: "power3.inOut"
                    },
                }
            });

            masterTl.addLabel("section_0");

            for (let i = 1; i < sections.length; i++) {
                const transitionDuration = 1.0;
                const dwellTime = 1.0;
                const previousLabel = `section_${i - 1}`;
                const currentLabel = `section_${i}`;
                const transitionStartLabel = `start_transition_to_${i}`;
                const headingWords = headingRefs.current[i] ? (headingRefs.current[i] as HTMLElement).querySelectorAll('.heading-word') : [];

                masterTl.addLabel(transitionStartLabel, `${previousLabel}+=${dwellTime}`);
                
                // --- FIXED: Robust Overlap Animation ---
                // The previous section remains stationary while the new one slides over it.
                // This prevents any gaps or visual glitches.
                masterTl
                    .to(sectionRefs.current[i], {
                        yPercent: 0,
                        ease: "expo.inOut",
                        duration: transitionDuration
                    }, transitionStartLabel)
                    // Animate text content in sync with the slide
                    .to(headingWords, {
                        y: 0,
                        stagger: 0.03,
                        ease: "power3.out",
                        duration: transitionDuration * 0.8
                    }, `${transitionStartLabel}+=0.3`);
                
                masterTl.addLabel(currentLabel, `${transitionStartLabel}+=${transitionDuration}`);
                
                // Animate the background image scale for a subtle Ken Burns effect
                if (bgRefs.current[i]) {
                  masterTl.to((bgRefs.current[i] as HTMLElement).querySelector('img'), {
                    scale: 1,
                    ease: "power1.inOut",
                    duration: dwellTime + transitionDuration
                  }, transitionStartLabel);
                }

                if (i === sections.length - 1 && infoBoxRef.current) {
                    masterTl.to(infoBoxRef.current, {
                        opacity: 1,
                        y: -20,
                        duration: 0.5
                    }, `${currentLabel}-=0.2`);
                }
            }
        };

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: componentRef.current,
                start: "top bottom-=10%",
                once: true,
                onEnter: setupAnimations,
            });
        }, componentRef);

        return () => ctx.revert();
    }, []);

    return (
        <ComponentWrapper ref={componentRef}>
            <GlobalStyle />
            <PinWrapper ref={pinWrapperRef} sections={sections.length}>
                <SliderContainer ref={sliderContainerRef}>
                    {sections.map((section, index) => (
                        <Section key={index} ref={el => { sectionRefs.current[index] = el || undefined; }}>
                            <Background ref={el => { bgRefs.current[index] = el || undefined; }}>
                                <BackgroundImage 
                                    src={section.imageUrl} 
                                    alt={`Web development and design section image: ${section.text}`} 
                                    onError={(e) => { e.currentTarget.src = placeholderImage(section.text); }}
                                />
                                <Overlay />
                                <SplitHeading
                                    ref={el => { headingRefs.current[index] = el || undefined; }}
                                    text={section.text}
                                    {...section.headingStyle}
                                />
                                {section.paragraph && (
                                    <InfoBox ref={infoBoxRef}>
                                        <InfoParagraph>{section.paragraph}</InfoParagraph>
                                    </InfoBox>
                                )}
                            </Background>
                        </Section>
                    ))}
                </SliderContainer>
            </PinWrapper>
        </ComponentWrapper>
    );
};

export default AdvancedSlider;