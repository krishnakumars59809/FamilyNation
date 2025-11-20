import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Shield } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';

const Consent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMinor = location.state?.isMinor || false;

  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);
  const participantId = `FN${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const handleConsent = () => {
    const allConsentsGiven = isMinor
      ? consent1 && consent2 && parentalConsent
      : consent1 && consent2;

    if (allConsentsGiven) {
      navigate('/questionnaire');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-emerald-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-blue-200 backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-3 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-12 bg-gradient-to-b from-blue-500 to-blue-300 rounded-full" />
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">
                Terms of Use & Privacy {isMinor && '(Under 18)'}
              </CardTitle>
            </div>
            <CardDescription className="text-base text-slate-500">
              {isMinor
                ? 'Parental consent required for users under 18'
                : 'Please read carefully before using our service'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Parental Consent Notice */}
            {isMinor && (
              <Alert className="bg-blue-100 border-blue-500">
                <Shield className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-slate-900">
                  <div className="font-semibold mb-1">
                    Important: Parental Consent Required
                  </div>
                  <p>
                    Since you are under 18 years of age, you must have
                    permission from a parent or legal guardian to use this
                    service. Please review this information with your
                    parent/guardian before proceeding.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {/* Service Title */}
            <div className="bg-gradient-to-r from-blue-200 to-yellow-200 p-6 rounded-xl border-l-4 border-blue-500 shadow-md">
              <h3 className="font-bold text-slate-900 mb-2 text-xl">
                Welcome to FamilyNation
              </h3>
              <p className="text-slate-900 text-lg">
                AI-Powered Family Mental Health Support with Hazel
              </p>
            </div>

            {/* About Hazel */}
            <div className="bg-yellow-100 p-5 rounded-xl border border-blue-200">
              <h3 className="font-bold text-slate-900 mb-3 text-lg flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                About Hazel
              </h3>
              <p className="text-slate-900 leading-relaxed">
                Hazel is an AI-powered chatbot designed by licensed family
                psychiatrists to provide supportive conversations about family
                mental health. Hazel helps you understand mental health
                indicators and provides guidance for family wellbeing.
              </p>
            </div>

            {/* Experience Block */}
            <div className="bg-emerald-100 p-5 rounded-xl border border-blue-200">
              <h3 className="font-bold text-slate-900 mb-3 text-lg flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                What You'll Experience
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-slate-900">
                <li>Complete a brief PHQ-2 mental health screening</li>
                <li>Chat with Hazel about your family’s well-being</li>
                <li>Receive personalized insights</li>
                <li>Get guidance tailored to your family's needs</li>
              </ol>
              <p className="text-sm text-blue-600 font-semibold mt-3 bg-blue-100 px-3 py-2 rounded-lg inline-block">
                Average session: 5–10 minutes
              </p>
            </div>

            {/* Privacy & Data Protection */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Privacy & Data Protection
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <div>
                    <strong className="text-slate-900">Anonymous:</strong>
                    <span className="text-slate-900">
                      {' '}
                      No personal identifying information required
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <div>
                    <strong className="text-slate-900">Conversations:</strong>
                    <span className="text-slate-900">
                      {' '}
                      Real-time processing, not permanently stored
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <div>
                    <strong className="text-slate-900">Data stored:</strong>
                    <span className="text-slate-900">
                      {' '}
                      Only anonymized insights
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <div>
                    <strong className="text-slate-900">Secure:</strong>
                    <span className="text-slate-900">
                      {' '}
                      Encrypted and stored safely
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <div>
                    <strong className="text-slate-900">Your control:</strong>
                    <span className="text-slate-900">
                      {' '}
                      You may stop anytime
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Important Notice */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Important Notice
              </h3>
              <p className="text-slate-900 mb-2">
                <strong>Not a substitute for professional care:</strong> Hazel
                provides supportive guidance but is not a replacement for
                professional treatment.
              </p>
              <p className="text-slate-900">
                <strong>Educational purpose:</strong> Information is designed to
                help you understand mental health better.
              </p>
            </div>

            {/* Crisis Section */}
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>
                <div className="font-semibold mb-2">Crisis Resources</div>
                <p className="mb-2">If distressed:</p>
                <ul className="space-y-1">
                  <li>
                    <strong>123 Suicide & Crisis Lifeline:</strong> Call/text
                    123
                  </li>
                  <li>
                    <strong>Crisis Text Line:</strong> Text HOME to 111 222
                  </li>
                  <li>
                    <strong>NAMI Helpline:</strong> 1-123-456-NAMI
                  </li>
                  {isMinor && (
                    <li>
                      <strong>Talk to a trusted adult</strong>
                    </li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>

            {/* Parental Guidance */}
            {isMinor && (
              <div className="bg-yellow-200 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">
                  For Parents/Guardians
                </h3>
                <p className="text-slate-900 mb-2">
                  Parents should review this service with their child.
                </p>
                <p className="text-slate-900">
                  Not intended to diagnose or treat mental health conditions.
                </p>
              </div>
            )}

            {/* Voluntary Use */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Voluntary Use
              </h3>
              <p className="text-slate-900">You may stop at any time.</p>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Questions or Support
              </h3>
              <p className="text-slate-900">
                Contact: support@familynation.com
              </p>
            </div>

            {/* Consent Checkboxes */}
            <div className="border-t border-slate-300 pt-6 space-y-4">
              <h3 className="font-semibold text-slate-900 text-lg mb-4">
                Agreement to Proceed
              </h3>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={consent1}
                  onChange={(e) => setConsent1(e.target.checked)}
                  className="h-4 w-4 accent-blue-600 cursor-pointer"
                />
                <label className="text-sm text-slate-900 leading-relaxed cursor-pointer">
                  I have read and understood the terms above. I agree to use
                  Hazel and understand this is not a substitute for professional
                  mental health care.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={consent2}
                  onChange={(e) => setConsent2(e.target.checked)}
                  className="h-4 w-4 accent-blue-600 cursor-pointer"
                />
                <label className="text-sm text-slate-900 leading-relaxed cursor-pointer">
                  I consent to the anonymous collection and secure storage of my
                  screening responses and conversation insights for service
                  improvement.
                </label>
              </div>

              {isMinor && (
                <div className="flex items-start space-x-3 bg-blue-100 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    checked={parentalConsent}
                    onChange={(e) => setParentalConsent(e.target.checked)}
                    className="h-4 w-4 accent-blue-600 cursor-pointer"
                  />
                  <label className="text-sm text-slate-900 leading-relaxed cursor-pointer font-semibold">
                    I am a parent or legal guardian, and I give permission for
                    my child (under 18) to use this service. I have reviewed the
                    information above with my child and understand the nature of
                    this service.
                  </label>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/welcome')}
                  className="flex-1 border-blue-300 hover:bg-blue-100 hover:border-blue-500"
                >
                  Back
                </Button>

                <Button
                  onClick={handleConsent}
                  disabled={
                    isMinor
                      ? !consent1 || !consent2 || !parentalConsent
                      : !consent1 || !consent2
                  }
                  className="flex-1 text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 shadow-lg transition-all"
                >
                  I Agree - Continue
                </Button>
              </div>

              <p className="text-xs text-slate-500 text-center pt-2">
                Participant ID: {participantId} | Date:{' '}
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Consent;
