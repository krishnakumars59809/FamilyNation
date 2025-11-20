import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
interface QuestionnaireProps {
  setChatbotOpen: (open: boolean) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ setChatbotOpen }) => {
  const navigate = useNavigate();
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');

  // audioUnlock.ts
  let audioUnlocked = false;
  const unlockIOSAudio = async () => {
    if (audioUnlocked) return;

    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      ctx.close();
      audioUnlocked = true;
      console.log('🔓 iOS audio unlocked');
    } catch (err) {
      console.warn('Audio unlock failed:', err);
    }
  };

  const handleChatbotOpen = async () => {
    // setChatbotOpen(true);
    alert(
      'Thank you for completing the questionnaire. You will now be redirected to the welcome page to start chatting with Hazel.'
    );
    navigate('/');
    await unlockIOSAudio();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-emerald-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-2xl border-blue-300 backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-3 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-12 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full" />
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Wellness Screening
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Step 2 of 2: Understanding your mental wellness
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Alert */}
            <Alert className="bg-gradient-to-r from-blue-100 to-emerald-100 border-blue-400 shadow-md">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-gray-800">
                <strong className="text-blue-600">Important:</strong> These are
                standard mental health screening questions used by healthcare
                professionals worldwide. Please answer honestly based on the
                last 2 weeks.
              </AlertDescription>
            </Alert>

            {/* Question 1 */}
            {/* Question 1 */}
            <div className="space-y-5 bg-white p-6 rounded-xl border border-blue-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 leading-relaxed">
                  Over the last 2 weeks, how often have you been bothered by{' '}
                  <span className="text-blue-600">
                    little interest or pleasure in doing things?
                  </span>
                </h3>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="q1-0"
                  className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <input
                    type="radio"
                    id="q1-0"
                    name="question1"
                    value="0"
                    checked={question1 === '0'}
                    onChange={(e) => setQuestion1(e.target.value)}
                    className="h-5 w-5"
                  />
                  <span className="flex-1 text-gray-800 font-medium">
                    Not at all
                  </span>
                </label>

                <label
                  htmlFor="q1-1"
                  className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <input
                    type="radio"
                    id="q1-1"
                    name="question1"
                    value="1"
                    checked={question1 === '1'}
                    onChange={(e) => setQuestion1(e.target.value)}
                    className="h-5 w-5"
                  />
                  <span className="flex-1 text-gray-800 font-medium">
                    Several days
                  </span>
                </label>

                <label
                  htmlFor="q1-2"
                  className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <input
                    type="radio"
                    id="q1-2"
                    name="question1"
                    value="2"
                    checked={question1 === '2'}
                    onChange={(e) => setQuestion1(e.target.value)}
                    className="h-5 w-5"
                  />
                  <span className="flex-1 text-gray-800 font-medium">
                    More than half the days
                  </span>
                </label>

                <label
                  htmlFor="q1-3"
                  className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <input
                    type="radio"
                    id="q1-3"
                    name="question1"
                    value="3"
                    checked={question1 === '3'}
                    onChange={(e) => setQuestion1(e.target.value)}
                    className="h-5 w-5"
                  />
                  <span className="flex-1 text-gray-800 font-medium">
                    Nearly every day
                  </span>
                </label>
              </div>
            </div>

            {/* Question 2 */}
            {/* Question 2 */}
            <div className="space-y-5 bg-white p-6 rounded-xl border border-blue-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 leading-relaxed">
                  Over the last 2 weeks, how often have you been bothered by{' '}
                  <span className="text-blue-600">
                    feeling down, depressed, or hopeless?
                  </span>
                </h3>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="q2-0"
                  className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <input
                    type="radio"
                    id="q2-0"
                    name="question2"
                    value="0"
                    checked={question2 === '0'}
                    onChange={(e) => setQuestion2(e.target.value)}
                    className="h-5 w-5"
                  />
                  <span className="flex-1 text-gray-800 font-medium">
                    Not at all
                  </span>
                </label>

                <label
                  htmlFor="q2-1"
                  className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <input
                    type="radio"
                    id="q2-1"
                    name="question2"
                    value="1"
                    checked={question2 === '1'}
                    onChange={(e) => setQuestion2(e.target.value)}
                    className="h-5 w-5"
                  />
                  <span className="flex-1 text-gray-800 font-medium">
                    Several days
                  </span>
                </label>

                <label
                  htmlFor="q2-2"
                  className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <input
                    type="radio"
                    id="q2-2"
                    name="question2"
                    value="2"
                    checked={question2 === '2'}
                    onChange={(e) => setQuestion2(e.target.value)}
                    className="h-5 w-5"
                  />
                  <span className="flex-1 text-gray-800 font-medium">
                    More than half the days
                  </span>
                </label>

                <label
                  htmlFor="q2-3"
                  className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <input
                    type="radio"
                    id="q2-3"
                    name="question2"
                    value="3"
                    checked={question2 === '3'}
                    onChange={(e) => setQuestion2(e.target.value)}
                    className="h-5 w-5"
                  />
                  <span className="flex-1 text-gray-800 font-medium">
                    Nearly every day
                  </span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-blue-200">
              <Button
                variant="outline"
                onClick={() => navigate('/consent')}
                className="flex-1 border-blue-300 hover:bg-blue-50 hover:border-blue-500"
                size="lg"
              >
                Back
              </Button>

              <Button
                onClick={handleChatbotOpen}
                disabled={!question1 || !question2}
                className="flex-1 text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-blue-300 transition-all disabled:opacity-50"
                size="lg"
              >
                Continue to Chat with Hazel
              </Button>
            </div>

            <p className="text-sm text-center text-gray-500 pt-3">
              🔒 Your responses are confidential and used only to provide
              personalized support
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Questionnaire;
