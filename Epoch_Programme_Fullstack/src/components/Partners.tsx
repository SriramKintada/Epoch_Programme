

export default function Partners() {
    return (
        <section className="section border-y" id="partners">
            <div className="container">
                <div className="section-label">// INFRASTRUCTURE NODE</div>
                <h2 className="section-title">Built with serious institutions.</h2>

                <div className="partners-grid fade-in">
                    {/* A3 Capital */}
                    <div className="partner-card">
                        <div className="partner-logo a3-logo">
                            <img src="https://oslhhlifshwcjrogbtbh.supabase.co/storage/v1/object/public/logos/Logo_A3_Capitals.png" alt="A3 Capital Logo" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                        </div>
                        <div className="partner-role">PROGRAM OPERATOR & STRATEGY</div>
                        <p>Designing EPOCH as a high-throughput, execution-ruthless pipeline for India's deepest technical talent.</p>
                    </div>

                    {/* HSBC */}
                    <div className="partner-card highlight-glow" style={{ transitionDelay: '0.1s' }}>
                        <div className="partner-logo hsbc-logo">
                            <img src="https://oslhhlifshwcjrogbtbh.supabase.co/storage/v1/object/public/logos/HSBC_Fixed.png" alt="HSBC Innovation Banking Logo" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                        </div>
                        <div className="partner-role">BANKING PARTNER & ADVISOR</div>
                        <p>Sponsoring initial ecosystem meetings and directly advising founders, laying the groundwork for deeper incubation efforts.</p>
                    </div>

                    {/* AI Grants India */}
                    <div className="partner-card" style={{ transitionDelay: '0.2s' }}>
                        <div className="partner-logo aig-logo">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img src="https://oslhhlifshwcjrogbtbh.supabase.co/storage/v1/object/public/logos/Pure_Flag.png" alt="India Flag" style={{ height: '40px', width: 'auto' }} />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 'bold', color: '#ffffff' }}>AI GRANTS INDIA</span>
                            </div>
                        </div>
                        <div className="partner-role">CO-ORGANISER & INFRA PROVIDER</div>
                        <p>Deploying heavy compute resources. Unleashing Anthropic, Google, and OpenAI bandwidth for zero-friction AI development.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
