import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function EditApplication() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [found, setFound] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [appId, setAppId] = useState<string>('');
    const [applyType, setApplyType] = useState<'solo' | 'team'>('solo');

    const DEADLINE = new Date('2026-04-02T18:00:00+05:30');
    const isPastDeadline = new Date() > DEADLINE;

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

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isPastDeadline) {
            setError('Applications are closed. Editing is no longer available.');
            setLoading(false);
            return;
        }

        try {
            const { data, error: fetchError } = await supabase
                .from('applications')
                .select('*')
                .eq('email', email.trim().toLowerCase())
                .limit(1)
                .single();

            if (fetchError || !data) {
                setError('No application found with this email. Check the address and try again.');
                setLoading(false);
                return;
            }

            setAppId(data.id);
            setApplyType(data.apply_type === 'team' ? 'team' : 'solo');
            setFormData({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                city: data.city || '',
                best_link: data.best_link || '',
                twitter_url: data.twitter_url || '',
                apply_type: data.apply_type || 'solo',
                track: data.track || 'STAGE 0',
                building: data.building || '',
                impressive: data.impressive || '',
                why_epoch: data.why_epoch || '',
                can_commit: data.can_commit || '',
                video_url: data.video_url || '',
                team_size: data.team_size || '',
                team_members: data.team_members || '',
                team_role: data.team_role || ''
            });
            setFound(true);
            setLoading(false);
        } catch {
            setError('Something went wrong. Try again.');
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTypeSwitch = (type: 'solo' | 'team') => {
        setApplyType(type);
        setFormData({ ...formData, apply_type: type });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        if (isPastDeadline) {
            setError('Applications are closed. Editing is no longer available.');
            setSaving(false);
            return;
        }

        try {
            const payload = {
                name: formData.name,
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
                project_description: formData.building || 'N/A',
                github_url: formData.best_link || '',
            };

            const { error: updateError } = await supabase
                .from('applications')
                .update(payload)
                .eq('id', appId);

            if (updateError) {
                setError(updateError.message);
                setSaving(false);
                return;
            }

            setSaved(true);
            setSaving(false);
        } catch {
            setError('Something went wrong. Try again.');
            setSaving(false);
        }
    };

    if (saved) {
        return (
            <section className="apply-section">
                <div className="apply-container">
                    <div className="apply-box fade-in" style={{ textAlign: 'center' }}>
                        <h2 className="section-title">APPLICATION UPDATED.</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Your changes have been saved. You can come back and edit again anytime before April 2, 6:00 PM IST.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
                            <button className="btn-secondary" onClick={() => { setSaved(false); }}>EDIT AGAIN</button>
                            <Link to="/" className="btn-secondary">RETURN TO ROOT</Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!found) {
        return (
            <section className="apply-section">
                <div className="apply-container">
                    <Link to="/" className="nav-logo" style={{ marginBottom: '4rem', display: 'inline-block' }}>
                        &lt; RETURN
                    </Link>
                    <h1 className="massive-text fade-in">EDIT APPLICATION.</h1>

                    <div className="apply-box fade-in" style={{ transitionDelay: '0.1s' }}>
                        <div className="sys-message">
                            <p className="prompt">&gt; EDIT PROTOCOL // ACTIVATED</p>
                            <p style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>Already applied? Update your application here.</p>
                            <p>Enter the email you used when you applied. You can edit your responses anytime before the deadline.</p>
                        </div>

                        {error && (
                            <div style={{ padding: '1rem', border: '1px solid #ff5f56', background: 'rgba(255, 95, 86, 0.1)', color: '#ff5f56', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
                                [ERROR]: {error}
                            </div>
                        )}

                        <form onSubmit={handleLookup}>
                            <div className="form-group">
                                <label>EMAIL ADDRESS *</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="The email you applied with"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="submit-section">
                                <button type="submit" className="btn-primary huge-btn" disabled={loading}>
                                    <div className="btn-edge-left"></div>
                                    {loading ? 'SEARCHING...' : 'FIND MY APPLICATION'}
                                    <div className="btn-edge-right"></div>
                                </button>
                            </div>
                        </form>
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
                <h1 className="massive-text fade-in">EDIT APPLICATION.</h1>

                <div className="apply-box fade-in" style={{ transitionDelay: '0.1s' }}>

                    <div className="sys-message">
                        <p className="prompt">&gt; EDITING APPLICATION FOR: {formData.email}</p>
                        <p>Make your changes below and save. You can edit as many times as you want before the deadline.</p>
                    </div>

                    {error && (
                        <div style={{ padding: '1rem', border: '1px solid #ff5f56', background: 'rgba(255, 95, 86, 0.1)', color: '#ff5f56', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
                            [ERROR]: {error}
                        </div>
                    )}

                    {/* Solo / Team Toggle */}
                    <div className="apply-toggle">
                        <button type="button" className={`toggle-btn ${applyType === 'solo' ? 'toggle-active' : ''}`} onClick={() => handleTypeSwitch('solo')}>SOLO FOUNDER</button>
                        <button type="button" className={`toggle-btn ${applyType === 'team' ? 'toggle-active' : ''}`} onClick={() => handleTypeSwitch('team')}>TEAM APPLICATION</button>
                    </div>
                    <p className="form-hint" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        {applyType === 'solo' ? "No co-founder? No problem. Week 1 is built for team formation." : "Applying as a team? Great. Each member should also submit individually."}
                    </p>

                    <form onSubmit={handleSave}>

                        <div className="form-section-label">// BASICS</div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>FULL NAME *</label>
                                <input type="text" name="name" required placeholder="Full Name" value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>EMAIL</label>
                                <input type="email" name="email" disabled value={formData.email} style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                                <span className="form-hint">Email cannot be changed</span>
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

                        <div className="form-section-label">// SHOW US WHO YOU ARE</div>

                        <div className="form-group">
                            <label>ONE LINK THAT BEST REPRESENTS YOU *</label>
                            <input type="text" name="best_link" required placeholder="GitHub, LinkedIn, portfolio, live product" value={formData.best_link} onChange={handleChange} />
                            <span className="form-hint">Pick the one link that best shows what you can do. Not your resume. Your work.</span>
                        </div>

                        <div className="form-group">
                            <label>TWITTER / X</label>
                            <input type="text" name="twitter_url" placeholder="https://x.com/..." value={formData.twitter_url} onChange={handleChange} />
                        </div>

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
                                    <textarea name="team_members" required placeholder={"Priya Sharma \u2014 priya@gmail.com \u2014 Backend\nRahul Verma \u2014 rahul@gmail.com \u2014 Product"} value={formData.team_members} onChange={handleChange}></textarea>
                                    <span className="form-hint">Each team member should also submit their own individual application.</span>
                                </div>
                            </>
                        )}

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
                            <textarea name="building" required maxLength={300} placeholder="One paragraph. What's the problem, who has it, what's your solution?" value={formData.building} onChange={handleChange}></textarea>
                            <span className="form-hint char-count">{formData.building.length}/300</span>
                        </div>

                        <div className="form-group">
                            <label>WHAT'S THE MOST IMPRESSIVE THING YOU'VE BUILT OR DONE? *</label>
                            <textarea name="impressive" required maxLength={300} placeholder="A project, a hack, a business, a community. Links welcome." value={formData.impressive} onChange={handleChange}></textarea>
                            <span className="form-hint char-count">{formData.impressive.length}/300</span>
                        </div>

                        <div className="form-group">
                            <label>WHY EPOCH? WHAT DO YOU WANT FROM THIS? *</label>
                            <textarea name="why_epoch" required maxLength={200} placeholder="Be honest. Co-founder? First revenue? Accountability? Network?" value={formData.why_epoch} onChange={handleChange}></textarea>
                            <span className="form-hint char-count">{formData.why_epoch.length}/200</span>
                        </div>

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

                        <div className="form-section-label">// OPTIONAL BONUS</div>

                        <div className="form-group">
                            <label>60-SECOND VIDEO INTRO</label>
                            <input type="text" name="video_url" placeholder="Loom, YouTube, or Google Drive link" value={formData.video_url} onChange={handleChange} />
                            <span className="form-hint">Optional but powerful. 60 seconds, unedited. Applicants who submit a video are reviewed first.</span>
                        </div>

                        <div className="submit-section">
                            <button type="submit" className="btn-primary huge-btn" disabled={saving}>
                                <div className="btn-edge-left"></div>
                                {saving ? 'SAVING...' : 'SAVE CHANGES'}
                                <div className="btn-edge-right"></div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
