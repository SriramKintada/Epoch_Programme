/**
 * EPOCH COHORT 2 — Founder Feedback & Assessment Engine
 * Connects to live Supabase Postgres backend (project oslhhlifshwcjrogbtbh)
 */

(function () {
    'use strict';

    // SUPABASE CONFIGURATION
    const SUPABASE_URL = 'https://oslhhlifshwcjrogbtbh.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zbGhobGlmc2h3Y2pyb2didGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDgzMzIsImV4cCI6MjA4ODIyNDMzMn0.2xSsDjJVyi1-H8m_5WsUXVM-H-imLLvY4Y2OZrOcH58';
    const FEEDBACK_TABLE = 'cohort2_feedback';

    // DOM Elements
    const form = document.getElementById('cohortFeedbackForm');
    const submitBtn = document.getElementById('btnSubmitFeedback');
    const submitSpinner = document.getElementById('submitSpinner');
    const submitBtnText = document.getElementById('submitBtnText');
    const errorBanner = document.getElementById('formErrorBanner');
    const errorMessage = document.getElementById('formErrorMessage');
    const successCard = document.getElementById('feedbackSuccessCard');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const npsFeedbackBadge = document.getElementById('npsFeedbackBadge');

    // Matrix Module Definitions
    const MODULE_KEYS = [
        'rating_legal_ip',
        'rating_product_validation',
        'rating_product_market_fit',
        'rating_gtm_strategy',
        'rating_pitch_deck',
        'rating_investor_readiness',
        'rating_program_structure'
    ];

    // Initialize Supabase Client if SDK is loaded
    let sbClient = null;
    if (window.supabase) {
        try {
            sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('⚡ [EPOCH] Supabase Client Initialized.');
        } catch (e) {
            console.warn('⚠️ [EPOCH] Supabase SDK init warning, fallback REST will be used:', e.message);
        }
    }

    // Initialize Page
    document.addEventListener('DOMContentLoaded', () => {
        setupCharCounters();
        setupMatrixSync();
        setupNpsFeedback();
        setupProgressTracker();
        setupFormValidationAndSubmit();
        setupNavbarScroll();
    });

    // Navbar Scroll Effect
    function setupNavbarScroll() {
        const nav = document.getElementById('nav');
        const hamburger = document.getElementById('hamburger');
        const navMobile = document.getElementById('navMobile');

        window.addEventListener('scroll', () => {
            if (nav) {
                if (window.scrollY > 30) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }
        });

        if (hamburger && navMobile) {
            hamburger.addEventListener('click', () => {
                const isOpen = navMobile.style.display === 'flex';
                navMobile.style.display = isOpen ? 'none' : 'flex';
            });
        }
    }

    // Live Character Counters for Textareas
    function setupCharCounters() {
        const textareas = document.querySelectorAll('textarea[data-counter-id]');
        textareas.forEach(textarea => {
            const counterId = textarea.getAttribute('data-counter-id');
            const counterEl = document.getElementById(counterId);
            if (counterEl) {
                const max = textarea.getAttribute('maxlength') || 2000;
                const updateCount = () => {
                    const current = textarea.value.length;
                    counterEl.textContent = `${current} / ${max} characters`;
                };
                textarea.addEventListener('input', updateCount);
                updateCount();
            }
        });
    }

    // Synchronize Desktop Matrix Table and Mobile Cards
    function setupMatrixSync() {
        MODULE_KEYS.forEach(key => {
            const desktopRadios = document.querySelectorAll(`input[name="${key}"]`);
            const mobileRadios = document.querySelectorAll(`input[name="m_${key}"]`);

            desktopRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.checked) {
                        const mobMatch = document.querySelector(`input[name="m_${key}"][value="${radio.value}"]`);
                        if (mobMatch) mobMatch.checked = true;
                        updateProgress();
                    }
                });
            });

            mobileRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.checked) {
                        const dskMatch = document.querySelector(`input[name="${key}"][value="${radio.value}"]`);
                        if (dskMatch) dskMatch.checked = true;
                        updateProgress();
                    }
                });
            });
        });
    }

    // NPS 1-10 Dynamic Badge Feedback
    function setupNpsFeedback() {
        const npsRadios = document.querySelectorAll('input[name="nps_score"]');
        npsRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const val = parseInt(radio.value, 10);
                if (npsFeedbackBadge) {
                    npsFeedbackBadge.style.display = 'block';
                    if (val >= 9) {
                        npsFeedbackBadge.innerHTML = `⭐ <strong>${val} / 10 — Promoter</strong> · Thank you for championing EPOCH!`;
                        npsFeedbackBadge.style.borderColor = 'rgba(74, 222, 128, 0.4)';
                        npsFeedbackBadge.style.background = 'rgba(74, 222, 128, 0.12)';
                        npsFeedbackBadge.style.color = '#86efac';
                    } else if (val >= 7) {
                        npsFeedbackBadge.innerHTML = `👍 <strong>${val} / 10 — Passive</strong> · We value your honest feedback to make Cohort 3 stellar.`;
                        npsFeedbackBadge.style.borderColor = 'rgba(250, 204, 21, 0.4)';
                        npsFeedbackBadge.style.background = 'rgba(250, 204, 21, 0.12)';
                        npsFeedbackBadge.style.color = '#fde047';
                    } else {
                        npsFeedbackBadge.innerHTML = `💬 <strong>${val} / 10 — Constructive</strong> · We are committed to refining the areas you highlighted.`;
                        npsFeedbackBadge.style.borderColor = 'rgba(248, 113, 113, 0.4)';
                        npsFeedbackBadge.style.background = 'rgba(248, 113, 113, 0.12)';
                        npsFeedbackBadge.style.color = '#fca5a5';
                    }
                }
                updateProgress();
            });
        });
    }

    // Real-Time Progress Tracker
    function setupProgressTracker() {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', updateProgress);
            input.addEventListener('change', updateProgress);
        });
        updateProgress();
    }

    function updateProgress() {
        // Essential requirement buckets
        let score = 0;
        const totalBuckets = 12; // 3 info + 7 modules + 1 impact + 1 nps

        // Section 1: Info (Founder Name, Startup Name, Email)
        const founderName = document.getElementById('founder_name')?.value.trim();
        const startupName = document.getElementById('startup_name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();

        if (founderName && founderName.length >= 2) score++;
        if (startupName && startupName.length >= 2) score++;
        if (email && email.includes('@') && email.includes('.')) score++;

        // Section 2: 7 Module ratings
        MODULE_KEYS.forEach(key => {
            const checked = document.querySelector(`input[name="${key}"]:checked`) || document.querySelector(`input[name="m_${key}"]:checked`);
            if (checked) score++;
        });

        // Section 3: Milestone progress
        const milestone = document.querySelector('input[name="milestone_progress"]:checked');
        if (milestone) score++;

        // Section 4: NPS
        const nps = document.querySelector('input[name="nps_score"]:checked');
        if (nps) score++;

        const percentage = Math.min(100, Math.round((score / totalBuckets) * 100));

        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressPercent) progressPercent.textContent = `${percentage}%`;
    }

    // Hide error banner on typing
    function clearError() {
        if (errorBanner) {
            errorBanner.style.display = 'none';
        }
        document.querySelectorAll('.input-invalid').forEach(el => el.classList.remove('input-invalid'));
    }

    function showError(msg, targetElement) {
        if (errorBanner && errorMessage) {
            errorMessage.textContent = msg;
            errorBanner.style.display = 'flex';
            errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (targetElement) {
            targetElement.classList.add('input-invalid');
            if (targetElement.focus) targetElement.focus();
        }
    }

    // Form Submission & Supabase Data Ingestion
    function setupFormValidationAndSubmit() {
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearError();

            // 1. Gather Section 1: Founder & Startup Info
            const founderName = document.getElementById('founder_name')?.value.trim();
            const startupName = document.getElementById('startup_name')?.value.trim();
            const roleTitle = document.getElementById('role_title')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim();
            const phone = document.getElementById('phone')?.value.trim() || '';

            if (!founderName || founderName.length < 2) {
                showError('Please enter the Founder Full Name.', document.getElementById('founder_name'));
                return;
            }

            if (!startupName || startupName.length < 2) {
                showError('Please enter your Startup Name.', document.getElementById('startup_name'));
                return;
            }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('Please enter a valid business or personal email address.', document.getElementById('email'));
                return;
            }

            // 2. Gather Section 2: Ratings (1-5)
            const ratings = {};
            for (const key of MODULE_KEYS) {
                const checked = document.querySelector(`input[name="${key}"]:checked`) || document.querySelector(`input[name="m_${key}"]:checked`);
                if (!checked) {
                    const friendlyName = getModuleFriendlyName(key);
                    showError(`Please provide a rating (1 to 5) for: "${friendlyName}".`, document.getElementById('section2Card'));
                    return;
                }
                ratings[key] = parseInt(checked.value, 10);
            }

            // 3. Gather Section 3: Strategic Impact
            const milestoneEl = document.querySelector('input[name="milestone_progress"]:checked');
            const valuableSession = document.getElementById('valuable_session')?.value.trim() || '';
            const neededDepthTopics = document.getElementById('needed_depth_topics')?.value.trim() || '';

            const milestoneProgress = milestoneEl ? milestoneEl.value : '';

            // 4. Gather Section 4: NPS (1-10)
            const npsEl = document.querySelector('input[name="nps_score"]:checked');
            if (!npsEl) {
                showError('Please select a Net Promoter Score (1 to 10) in Section 4.', document.getElementById('section4Card'));
                return;
            }
            const npsScore = parseInt(npsEl.value, 10);

            // 5. Gather Section 5: Testimonial & Quote
            const testimonial = document.getElementById('testimonial')?.value.trim() || '';
            const highlightQuote = document.getElementById('highlight_quote')?.value.trim() || '';
            const consentMedia = document.getElementById('consent_media_release')?.checked || false;

            // Construct Final Payload
            const payload = {
                founder_name: founderName,
                startup_name: startupName,
                role_title: roleTitle,
                email: email,
                phone: phone,
                rating_legal_ip: ratings.rating_legal_ip,
                rating_product_validation: ratings.rating_product_validation,
                rating_product_market_fit: ratings.rating_product_market_fit,
                rating_gtm_strategy: ratings.rating_gtm_strategy,
                rating_pitch_deck: ratings.rating_pitch_deck,
                rating_investor_readiness: ratings.rating_investor_readiness,
                rating_program_structure: ratings.rating_program_structure,
                milestone_progress: milestoneProgress,
                valuable_session: valuableSession,
                needed_depth_topics: neededDepthTopics,
                nps_score: npsScore,
                testimonial: testimonial,
                highlight_quote: highlightQuote,
                consent_media_release: consentMedia,
                raw_payload: {
                    submitted_at: new Date().toISOString(),
                    user_agent: navigator.userAgent,
                    screen_resolution: `${window.innerWidth}x${window.innerHeight}`,
                    platform: 'epoch.aigrants.in/feedback',
                    cohort: 'EPOCH Cohort 2'
                }
            };

            // Lock UI and show spinner
            setSubmittingState(true);

            try {
                const insertedRecord = await sendToSupabase(payload);
                console.log('✅ [EPOCH] Feedback successfully recorded:', insertedRecord);
                renderSuccessScreen(payload, insertedRecord);
            } catch (err) {
                console.error('❌ [EPOCH] Submission error:', err);
                showError(`Submission failed: ${err.message || 'Network error. Please try again.'}`);
                setSubmittingState(false);
            }
        });
    }

    // Friendly names for error reporting
    function getModuleFriendlyName(key) {
        switch (key) {
            case 'rating_legal_ip': return 'Legal, IP Advisory & Regulatory Compliance Frameworks';
            case 'rating_product_validation': return 'Product Validation, Tech Transfer & Scale-Up Guidance';
            case 'rating_product_market_fit': return 'Product-Market Fit & Deep-Tech Strategy';
            case 'rating_gtm_strategy': return 'Go-to-Market Strategy & Execution';
            case 'rating_pitch_deck': return 'Pitch Deck Refinement & Investment Banking Sessions';
            case 'rating_investor_readiness': return 'Investor Readiness & Pitching Day Preparation';
            case 'rating_program_structure': return 'Overall Program Structure, Scheduling & Execution';
            default: return 'Program Module';
        }
    }

    // Direct Supabase API Ingestion with REST Fallback
    async function sendToSupabase(payload) {
        // Strategy A: If Supabase JS client is available, use it
        if (sbClient) {
            try {
                const { data, error } = await sbClient
                    .from(FEEDBACK_TABLE)
                    .insert([payload])
                    .select();

                if (error) throw error;
                return (data && data[0]) ? data[0] : { id: 'epc_' + Math.random().toString(36).substr(2, 9), ...payload };
            } catch (sbErr) {
                console.warn('⚠️ [EPOCH] Supabase SDK insert failed, falling back to direct REST:', sbErr.message);
            }
        }

        // Strategy B: Direct HTTPS REST Fetch
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${FEEDBACK_TABLE}`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Database error (${response.status}): ${errText}`);
        }

        const resData = await response.json();
        return (resData && resData[0]) ? resData[0] : { id: 'epc_' + Math.random().toString(36).substr(2, 9), ...payload };
    }

    // Manage Submit Button State
    function setSubmittingState(isSubmitting) {
        if (!submitBtn) return;
        submitBtn.disabled = isSubmitting;
        if (submitSpinner) submitSpinner.style.display = isSubmitting ? 'inline-block' : 'none';
        if (submitBtnText) submitBtnText.textContent = isSubmitting ? 'Recording Assessment...' : 'Submit Assessment & Feedback';
    }

    // Render Clean Success Receipt Screen
    function renderSuccessScreen(payload, record) {
        const recordId = record.id || 'EPOCH-C2-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        const submissionDate = new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Asia/Kolkata'
        });

        // Hide Form and Progress Bar
        if (form) form.style.display = 'none';
        const progressWrapper = document.getElementById('progressBarWrapper');
        if (progressWrapper) progressWrapper.style.display = 'none';

        // Populate Receipt Info
        document.getElementById('receiptFounderName').textContent = payload.founder_name;
        document.getElementById('receiptStartupName').textContent = payload.startup_name;
        document.getElementById('receiptEmail').textContent = payload.email;
        document.getElementById('receiptNps').textContent = `${payload.nps_score} / 10`;
        document.getElementById('receiptId').textContent = recordId;
        document.getElementById('receiptDate').textContent = `${submissionDate} IST`;

        // Show Success Card
        if (successCard) {
            successCard.style.display = 'block';
            successCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

})();
