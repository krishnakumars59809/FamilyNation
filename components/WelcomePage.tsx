import { useNavigate } from 'react-router-dom';
import { Brain, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const Welcome = () => {
  const navigate = useNavigate();

  const handleAgeConfirm = (isAdult: boolean) => {
    navigate('/consent', { state: { isMinor: !isAdult } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 to-blue-50 mb-6 shadow-lg">
            <Brain className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 to-blue-300 bg-clip-text text-transparent mb-3">
            FamilyNation
          </h1>
          <p className="text-gray-900 text-xl font-medium">
            AI-Powered Family Mental Health Support
          </p>
        </div>

        <Card className="shadow-2xl border-blue-200 backdrop-blur-sm bg-white/70">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-200 rounded-full" />
              <CardTitle className="text-2xl text-gray-900">
                What You'll Do
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-200 to-transparent border-l-4 border-blue-500 hover:from-blue-300 transition-all">
                <CheckCircle2 className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-semibold">
                    Review Terms & Privacy
                  </p>
                  <p className="text-sm text-gray-600">Quick 2-minute read</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-200 to-transparent border-l-4 border-blue-500 hover:from-blue-300 transition-all">
                <CheckCircle2 className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-semibold">Wellness Check</p>
                  <p className="text-sm text-gray-600">
                    2 simple questions about your well-being
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-200 to-transparent border-l-4 border-blue-500 hover:from-blue-300 transition-all">
                <CheckCircle2 className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-semibold">Chat with Hazel</p>
                  <p className="text-sm text-gray-600">
                    5 minutes with our AI family support assistant
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-200 to-transparent border-l-4 border-blue-500 hover:from-blue-300 transition-all">
                <CheckCircle2 className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-semibold">
                    Get Personalized Insights
                  </p>
                  <p className="text-sm text-gray-600">
                    Tailored guidance for your family's mental health
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Are you 18 years or older?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => handleAgeConfirm(true)}
                  className="flex-1 text-white bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 shadow-lg transition-all"
                  size="lg"
                >
                  Yes, I'm 18 or older
                </Button>

                <Button
                  onClick={() => handleAgeConfirm(false)}
                  variant="outline"
                  className="flex-1 border-blue-400 hover:bg-blue-100 hover:border-blue-500"
                  size="lg"
                >
                  No, I'm under 18
                </Button>
              </div>
            </div>

            <div className="bg-yellow-300 p-4 rounded-xl border border-blue-200 text-center">
              <p className="text-sm text-gray-900 font-medium">
                💙 Join us in improving mental health support for families
                worldwide
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
