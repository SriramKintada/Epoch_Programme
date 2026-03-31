import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function ApplyForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [applyType, setApplyType] = useState<'solo' | 'team'>('solo');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        best_link: '',
        twitter_url: '',
        apply_type: 'solo',
        track: 'STAGE 0',
        building: '',
        impressive: '',
        why_epoch: '',
        can_commit: '',
        video_url: '',
        team_size: '',
        team_members: '',
        team_role: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTypeSwitch = (type: 'solo' | 'team') => {
        setApplyType(type);
        setFormData({ ...formData, apply_type: type });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {

        // Clean payload — no duplicate columns
        const payload = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            best_link: formData.best_link,
            twitter_url: formData.twitter_url || null,
            apply_type: formData.apply_type,
            track: formData.track,
            building: formData.building,
            impressive: formData.impressive,
            why_epoch: formData.why_epoch,
            can_commit: formData.can_commit,
            video_url: formData.video_url || null,
            team_size: formData.team_size || null,
            team_members: formData.team_members || null,
            team_role: formData.team_role || null,
            // Legacy columns for backwards compat
            project_description: formData.building || 'N/A',
            github_url: formData.best_link || '',
            status: 'pending'
        };

        const { error: insertError } = await supabase
            .from('applications')
            .insert([payload]);

        if (insertError) {
            setError(insertError.message);
            setLoading(false);
            return;
        }

        setSuccess(true);
        setLoading(false);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
            setError(msg);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <section className="apply-section">
                <div className="apply-container">
                    <div className="apply-box fade-in" style={{ textAlign: 'center' }}>
                        <h2 className="section-title">TRANSMISSION RECEIVED.</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Your application is being evaluated. Early applicants get priority — you're already ahead.
                        </p>
                        <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            We'll reach out via WhatsApp or email within 48 hours if you make the cut.
                        </p>
                        <Link to="/" className="btn-secondary">RETURN TO ROOT</Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="apply-section">
            <div className="apply-container">

                <Link to="/" className="nav-logo" style={{ marginBottom: '4rem', display: 'inline-block' }}>
                    &lt; RETURN
                </Link>
                <h1 className="massive-text fade-in">EXECUTE.</h1>

                <div className="apply-box fade-in" style={{ transitionDelay: '0.1s' }}>

                    {/* Deadline Banner */}
                    <div className="deadline-banner">
                        <div className="deadline-icon">⚡</div>
                        <div>
                            <p className="deadline-main">Applications close <strong>Thursday, April 2nd at 6:00 PM IST.</strong></p>
                            <p className="deadline-sub">Early applicants get priority review. The earlier you apply, the higher your chances.</p>
                        </div>
                    </div>

                    <div className="sys-message">
                        <p className="prompt">&gt; INITIATION PROTOCOL // ACTIVATED</p>
                        <p style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>This takes 3-4 minutes. That's it.</p>
                        <p>No pitch decks. No essays. Just sharp, honest answers. We're looking for builders — show us what you've done, not what you plan to do.</p>
                    </div>

                    {error && (
                        <div style={{ padding: '1rem', border: '1px solid #ff5f56', background: 'rgba(255, 95, 86, 0.1)', color: '#ff5f56', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
                            [ERROR]: {error}
                        </div>
                    )}

                    {/* Solo / Team Toggle */}
                    <div className="apply-toggle">
                        <button
                            type="button"
                            className={`toggle-btn ${applyType === 'solo' ? 'toggle-active' : ''}`}
                            onClick={() => handleTypeSwitch('solo')}
                        >
                            SOLO FOUNDER
                        </button>
                        <button
                            type="button"
                            className={`toggle-btn ${applyType === 'team' ? 'toggle-active' : ''}`}
                            onClick={() => handleTypeSwitch('team')}
                        >
                            TEAM APPLICATION
                        </button>
                    </div>
                    <p className="form-hint" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        {applyType === 'solo'
                            ? "No co-founder? No problem. Week 1 is built for team formation."
                            : "Applying as a team? Great — each member should also submit individually."}
                    </p>

                    <form onSubmit={handleSubmit}>

                        {/* ── BASICS ── */}
                        <div className="form-section-label">// BASICS</div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>FULL NAME *</label>
                                <input type="text" name="name" required placeholder="Full Name" value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>EMAIL *</label>
                                <input type="email" name="email" required placeholder="you@gmail.com" value={formData.email} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>PHONE / WHATSAPP *</label>
                                <input type="tel" name="phone" required placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>CITY *</label>
                                <input type="text" name="city" required placeholder="Pune" value={formData.city} onChange={handleChange} />
                            </div>
                        </div>

                        {/* ── LINKS ── */}
                        <div className="form-section-label">// SHOW US WHO YOU ARE</div>

                        <div className="form-group">
                            <label>ONE LINK THAT BEST REPRESENTS YOU *</label>
                            <input type="text" name="best_link" required placeholder="GitHub, LinkedIn, portfolio, live product, Behance — your strongest proof" value={formData.best_link} onChange={handleChange} />
                            <span className="form-hint">Pick the one link that best shows what you can do. Not your resume — your work.</span>
                        </div>

                        <div className="form-group">
                            <label>TWITTER / X</label>
                            <input type="text" name="twitter_url" placeholder="https://x.com/..." value={formData.twitter_url} onChange={handleChange} />
                        </div>

                        {/* ── TEAM FIELDS ── */}
                        {applyType === 'team' && (
                            <>
                                <div className="form-section-label">// YOUR TEAM</div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>TEAM SIZE *</label>
                                        <select name="team_size" required value={formData.team_size} onChange={handleChange}>
                                            <option value="">Select</option>
                                            <option value="2">2 people</option>
                                            <option value="3">3 people</option>
                                            <option value="4">4 people</option>
                                            <option value="5+">5+</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>YOUR ROLE *</label>
                                        <input type="text" name="team_role" required placeholder="Technical Lead, Product, Design, Business..." value={formData.team_role} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>TEAM MEMBERS (Names + Emails) *</label>
                                    <textarea name="team_members" required placeholder={"Priya Sharma — priya@gmail.com — Backend\nRahul Verma — rahul@gmail.com — Product"} value={formData.team_members} onChange={handleChange}></textarea>
                                    <span className="form-hint">Each team member should also submit their own individual application.</span>
                                </div>
                            </>
                        )}

                        {/* ── THE REAL QUESTIONS ── */}
                        <div className="form-section-label">// THE REAL QUESTIONS</div>

                        <div className="form-group">
                            <label>TRACK *</label>
                            <select name="track" value={formData.track} onChange={handleChange}>
                                <option value="STAGE 0">STAGE 0 — I have an idea but no product yet</option>
                                <option value="STAGE 1">STAGE 1 — I have a product and want to scale it</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>WHAT ARE YOU BUILDING? (or want to build) *</label>
                            <textarea name="building" required maxLength={300} placeholder="One paragraph. What's the problem, who has it, what's your solution? Be specific." value={formData.building} onChange={handleChange}></textarea>
                            <span className="form-hint char-count">{formData.building.length}/300</span>
                        </div>

                        <div className="form-group">
                            <label>WHAT'S THE MOST IMPRESSIVE THING YOU'VE BUILT OR DONE? *</label>
                            <textarea name="impressive" required maxLength={300} placeholder="A project, a hack, a business, a community — anything that shows you can execute. Links welcome." value={formData.impressive} onChange={handleChange}></textarea>
                            <span className="form-hint char-count">{formData.impressive.length}/300</span>
                        </div>

                        <div className="form-group">
                            <label>WHY EPOCH? WHAT DO YOU WANT FROM THIS? *</label>
                            <textarea name="why_epoch" required maxLength={200} placeholder="Be honest. Co-founder? First revenue? Accountability? Network? What specifically?" value={formData.why_epoch} onChange={handleChange}></textarea>
                            <span className="form-hint char-count">{formData.why_epoch.length}/200</span>
                        </div>

                        {/* ── COMMITMENT ── */}
                        <div className="form-section-label">// COMMITMENT</div>

                        <div className="form-group">
                            <label>CAN YOU COMMIT TO ALL 4 WEEKENDS IN PUNE? *</label>
                            <select name="can_commit" required value={formData.can_commit} onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="yes_all">Yes — I can make all 4 weekends</option>
                                <option value="yes_most">I can make 3 out of 4</option>
                                <option value="unsure">Not sure yet — depends on dates</option>
                                <option value="remote">I'd need to join some weekends remotely</option>
                            </select>
                            <span className="form-hint">Weekends are mandatory and in-person at Flairmind Office Club, Aundh, Pune.</span>
                        </div>

                        {/* ── OPTIONAL BONUS ── */}
                        <div className="form-section-label">// OPTIONAL BONUS</div>

                        <div className="form-group">
                            <label>60-SECOND VIDEO INTRO</label>
                            <input type="text" name="video_url" placeholder="Loom, YouTube, or Google Drive link" value={formData.video_url} onChange={handleChange} />
                            <span className="form-hint">Optional but powerful. 60 seconds, unedited. Tell us who you are and what you're building. Applicants who submit a video are reviewed first.</span>
                        </div>

                        {/* ── SUBMIT ── */}
                        <div className="submit-section">
                            <p className="submit-reminder">⚡ Deadline: Thursday, April 2nd, 6:00 PM IST. Early submissions = priority review.</p>
                            <button type="submit" className="btn-primary huge-btn" disabled={loading}>
                                <div className="btn-edge-left"></div>
                                {loading ? 'TRANSMITTING...' : 'SUBMIT APPLICATION'}
                                <div className="btn-edge-right"></div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
