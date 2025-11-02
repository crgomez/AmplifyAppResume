import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl">
          <span className="highlight-box text-lg md:text-xl mb-6">
            Manager, Security Engineering
          </span>
          
          <h1 className="mt-6 mb-8">
            Building insider threat detection & incident response programs
          </h1>
          
          <div className="space-y-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
            <p className="text-foreground font-medium">Hi! I'm Carlos,</p>
            <p>
              <span className="text-primary font-medium">A Security Engineering Leader</span> with advanced training in AI/ML and data-driven leadership. 
              Over 11 years of experience in insider threat detection (ITD) and incident response (IR) with quantitative decision-making frameworks to drive strategic security initiatives.
            </p>
            <p>
              Developed and scaled both ITD & IR programs across Amazon Devices Subsidiaries & Acquisitions 
              (Amazon Alexa, Blink, Eero, Ring, Key, & Zoox) through data-driven risk mitigation and advanced detection capabilities.
            </p>
            
            <div className="pt-4 flex gap-4">
              <Button variant="outline" size="lg" className="smooth-transition">
                Contact me →
              </Button>
              <Button variant="default" size="lg" className="smooth-transition">
                Download Resume
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="container mx-auto px-6 py-16">
        <p className="text-xl mb-8">Key areas of expertise:</p>
        
        <div className="flex flex-wrap gap-2 mb-12">
          <span className="tag">Insider Threat Detection</span>
          <span className="tag">Incident Response</span>
          <span className="tag">AI/ML & Data Science</span>
          <span className="tag">Security Engineering</span>
          <span className="tag">SOAR & SIEM</span>
        </div>

        {/* Experience Cards */}
        <div className="space-y-16">
          {/* Amazon Devices - Manager */}
          <article className="card-soft">
            <div className="p-8 md:p-12">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Insider Threat</Badge>
                <Badge variant="secondary">AI/ML</Badge>
                <Badge variant="secondary">Leadership</Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                2022 - Present • Amazon • Devices Subsidiaries & Acquisitions
              </p>
              
              <h2 className="mb-6">Manager, Insider Threat Program</h2>
              
              <p className="text-lg text-muted-foreground mb-6">
                Led cross-functional team developing enterprise-scale insider threat detection capabilities across Amazon's hardware subsidiaries (Ring, Blink, Eero) and autonomous vehicle division (Zoox).
              </p>
              
              <div className="text-4xl font-bold mb-2">4k+</div>
              <p className="text-muted-foreground mb-8">
                AWS accounts monitored with centralized security analytics platform processing CloudTrail telemetry
              </p>
              
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li>• Architected 50+ custom threat indicators and automated correlation algorithms for real-time risk assessment</li>
                <li>• Implemented orchestration middleware security controls protecting Ring's ~40M Monthly Active Users</li>
                <li>• Reduced MTTD and MTTR through comprehensive Threat Lifecycle Management Framework</li>
              </ul>
            </div>
          </article>

          {/* Ring - Security Engineer III */}
          <article className="card-soft">
            <div className="p-8 md:p-12">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Security Engineering</Badge>
                <Badge variant="secondary">SOAR</Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                2020 - 2022 • Amazon • Ring (RBKS)
              </p>
              
              <h2 className="mb-6">Security Engineer III, Lead Insider Threat Program</h2>
              
              <p className="text-lg text-muted-foreground mb-6">
                Conducted case-studies highlighting security & privacy risks, gaining stakeholder sponsorship to develop Ring's Insider Threat Program under Defensive Security.
              </p>
              
              <div className="text-4xl font-bold mb-2">35.8M</div>
              <p className="text-muted-foreground mb-8">
                customer accounts protected through Two Person Authorization (2PA) security controls implementation
              </p>
              
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li>• Reduced AWS CloudWatch log onboarding from 3-4 weeks to 30 minutes</li>
                <li>• Implemented automated SOAR pipeline for enhanced threat response</li>
                <li>• Mitigated internal threat vectors for account takeover attacks</li>
              </ul>
            </div>
          </article>

          {/* Ring - Incident Response */}
          <article className="card-soft">
            <div className="p-8 md:p-12">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Incident Response</Badge>
                <Badge variant="secondary">Digital Forensics</Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                2018 - 2020 • Ring • Security Engineering
              </p>
              
              <h2 className="mb-6">Security Engineer II, Incident Response</h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                Authored Ring's Incident Response Protocols/Procedures built on F3EAD framework and NIST Computer Security Incident Response Guide. Led Engineering, Legal, PR, and Stakeholders through Intelligence-Driven Incident Response Cycle.
              </p>
            </div>
          </article>

          {/* Google - Previous Experience */}
          <article className="card-soft">
            <div className="p-8 md:p-12">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Cloud Platform</Badge>
                <Badge variant="secondary">Full Stack</Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                2016 - 2018 • Google • IT Operations & Cloud Platform
              </p>
              
              <h2 className="mb-6">IT Operations & Full Stack Engineer (Rotation)</h2>
              
              <p className="text-lg text-muted-foreground mb-6">
                Provided support to 130K+ Googlers and developed data analytics platform for cloud infrastructure optimization.
              </p>
              
              <div className="text-4xl font-bold mb-2">80%</div>
              <p className="text-muted-foreground mb-8">
                reduction in Google Cloud Storage partner data tracking dashboard load times
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Education & Skills Section */}
      <section className="container mx-auto px-6 py-16 mb-20">
        <h3 className="mb-8">Education & Professional Development</h3>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="card-soft">
            <div className="p-8">
              <h4 className="text-xl font-semibold mb-4">Academic Background</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><strong className="text-foreground">MS Homeland Security</strong><br />InfoSec & Forensics • Penn State University</li>
                <li><strong className="text-foreground">BS Information Systems Security</strong><br />Azusa Pacific University</li>
                <li><strong className="text-foreground">AS Behavioral & Social Science</strong><br />Los Angeles Southwest College</li>
              </ul>
            </div>
          </div>
          
          <div className="card-soft">
            <div className="p-8">
              <h4 className="text-xl font-semibold mb-4">Executive Education</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><strong className="text-foreground">Leading in a Data-Driven World</strong><br />Columbia Business School Executive Education</li>
                <li><strong className="text-foreground">Demystifying AI</strong><br />Stanford Continuous Studies</li>
                <li><strong className="text-foreground">The Mindful Manager</strong><br />Stanford Continuous Studies</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card-soft max-w-4xl">
          <div className="p-8 md:p-12">
            <h4 className="text-xl font-semibold mb-6">Technical Skills</h4>
            <div className="grid md:grid-cols-3 gap-6 text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground mb-2">Security Engineering</p>
                <p className="text-sm">Threat Hunting, Incident Response, Digital Forensics, SOAR, SIEM Platforms</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-2">AI/ML & Data Science</p>
                <p className="text-sm">Business Intelligence, Risk Modeling, Predictive Analytics, Machine Learning, Anomaly Detection</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-2">Leadership & Strategy</p>
                <p className="text-sm">Conflict Resolution, Operational Planning, Talent Management, Resource Budgeting</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
