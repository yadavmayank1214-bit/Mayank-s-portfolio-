document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const countElement = document.getElementById("loader-counter");
    const progressInner = document.getElementById("load-progress-inner");
    const loadingScreen = document.getElementById("loading-screen");
    const mainInterface = document.getElementById("main-interface");
    const loaderWord = document.getElementById("loader-word");

    const configurationWords = ["ANALYZE", "MANIPULATE", "VISUALIZE", "ENGINEER"];
    let wordIdx = 0;

    const wordEngineInterval = setInterval(() => {
        wordIdx = (wordIdx + 1) % configurationWords.length;
        gsap.to(loaderWord, {
            y: -15, opacity: 0, duration: 0.25, onComplete: () => {
                loaderWord.textContent = configurationWords[wordIdx];
                gsap.fromTo(loaderWord, { y: 15, opacity: 0 }, { y: 0, opacity: 0.8, duration: 0.25 });
            }
        });
    }, 675);

    const loaderDuration = 2700; 
    const launchTimestamp = performance.now();

    function cycleSystemLoader(timestamp) {
        const delta = timestamp - launchTimestamp;
        const currentRatio = Math.min(delta / loaderDuration, 1);
        const processingInt = Math.floor(currentRatio * 100);
        
        if(countElement) countElement.textContent = String(processingInt).padStart(3, "0");
        if(progressInner) progressInner.style.width = `${processingInt}%`;

        if (currentRatio < 1) {
            requestAnimationFrame(cycleSystemLoader);
        } else {
            clearInterval(wordEngineInterval);
            setTimeout(() => {
                gsap.to(loadingScreen, {
                    opacity: 0, duration: 0.4, onComplete: () => {
                        if(loadingScreen) loadingScreen.style.display = "none";
                        if(mainInterface) mainInterface.classList.remove("invisible");
                        fireHeroSequences();
                    }
                });
            }, 400);
        }
    }
    requestAnimationFrame(cycleSystemLoader);

    const functionalPositions = ["Data Analyst", "BCA System Developer", "Insight Architect", "Prompt Specialist"];
    let positionIdx = 0;
    const placeholderShell = document.getElementById("cycling-role");

    setInterval(() => {
        if (!placeholderShell) return;
        positionIdx = (positionIdx + 1) % functionalPositions.length;
        placeholderShell.classList.remove("animate-role-fade-in");
        void placeholderShell.offsetWidth; 
        placeholderShell.textContent = functionalPositions[positionIdx];
        placeholderShell.classList.add("animate-role-fade-in");
    }, 2000);

    const backgroundMediaUrl = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";
    const heroMediaNode = document.getElementById("hero-video");
    const footerMediaNode = document.getElementById("footer-video");

    function initializeMediaStream(mediaNode) {
        if (!mediaNode) return;
        if (Hls.isSupported()) {
            const systemHlsInstance = new Hls();
            systemHlsInstance.loadSource(backgroundMediaUrl);
            systemHlsInstance.attachMedia(mediaNode);
        } else if (mediaNode.canPlayType('application/vnd.apple.mpegurl')) {
            mediaNode.src = backgroundMediaUrl;
        }
    }
    initializeMediaStream(heroMediaNode);
    initializeMediaStream(footerMediaNode);

    function fireHeroSequences() {
        const entryTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        entryTimeline.fromTo(".name-reveal", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2 }, 0.1);
        entryTimeline.fromTo(".blur-in", { opacity: 0, y: 15, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.1 }, 0.3);
    }

    const navbarPill = document.getElementById("navbarPill");
    const scrollContainer = document.getElementById("scrollContainer");
    const functionalSections = document.querySelectorAll("section");
    const navigationItems = document.querySelectorAll(".nav-item");

    if (scrollContainer && navbarPill) {
        scrollContainer.addEventListener("scroll", () => {
            let activeSectionId = "home";
            const currentOffset = scrollContainer.scrollTop;

            if (currentOffset > 80) {
                navbarPill.style.boxShadow = "0 10px 20px -3px rgba(0,0,0,0.5)";
                navbarPill.style.borderColor = "rgba(255, 255, 255, 0.15)";
            } else {
                navbarPill.style.boxShadow = "none";
                navbarPill.style.borderColor = "rgba(255, 255, 255, 0.1)";
            }

            functionalSections.forEach(section => {
                const sectionOffset = section.offsetTop - 200;
                if (currentOffset >= sectionOffset) {
                    activeSectionId = section.getAttribute("id");
                }
            });

            navigationItems.forEach(item => {
                item.classList.remove("active");
                if (item.getAttribute("href") === `#${activeSectionId}`) {
                    item.classList.add("active");
                }
            });
        });
    }

    const elementRevealPool = document.querySelectorAll(".reveal-element");
    elementRevealPool.forEach(element => {
        gsap.fromTo(element, { opacity: 0, y: 20 }, {
            scrollTrigger: {
                trigger: element,
                scroller: "#scrollContainer",
                start: "top 90%",
                toggleActions: "play none none none"
            },
            opacity: 1, y: 0, duration: 0.8, ease: "power2.out"
        });
    });

    navigationItems.forEach(item => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            const destinationId = item.getAttribute("href");
            const destinationSection = document.querySelector(destinationId);
            if (destinationSection && scrollContainer) {
                scrollContainer.scrollTo({
                    top: destinationSection.offsetTop,
                    behavior: "smooth"
                });
            }
        });
    });

    if (window.innerWidth >= 900) {
        gsap.to("#col-left", {
            scrollTrigger: { trigger: "#playground", scroller: "#scrollContainer", start: "top bottom", end: "bottom top", scrub: true },
            y: -40, ease: "none"
        });
        gsap.to("#col-right", {
            scrollTrigger: { trigger: "#playground", scroller: "#scrollContainer", start: "top bottom", end: "bottom top", scrub: true },
            y: 40, ease: "none"
        });
    }

    const trackElement = document.getElementById("marqueeTrack");
    if (trackElement) {
        gsap.to(trackElement, { xPercent: -50, duration: 20, ease: "none", repeat: -1 });
    }
});