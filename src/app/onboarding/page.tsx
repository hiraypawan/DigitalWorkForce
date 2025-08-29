'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatBox from '@/components/ChatBox';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const [isComplete, setIsComplete] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const router = useRouter();

  const handleComplete = (data: any) => {
    setExtractedData(data);
    setIsComplete(true);
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to DigitalWorkforce!
          </h1>
          <p className="text-lg text-gray-600">
            Let&apos;s set up your profile with our AI assistant to get you started with the perfect tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Chatbot */}
          <div>
            <ChatBox onComplete={handleComplete} />
          </div>

          {/* Profile Preview */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Profile Preview
            </h2>
            
            {!extractedData ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChatBox className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">
                  Complete the chat to see your profile preview
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Skills */}
                {extractedData.skills && extractedData.skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {extractedData.skills.map((skill: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hobbies */}
                {extractedData.hobbies && extractedData.hobbies.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {extractedData.hobbies.map((hobby: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* About Me */}
                {extractedData.aboutMe && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">About Me</h3>
                    <p className="text-gray-700 text-sm">{extractedData.aboutMe}</p>
                  </div>
                )}

                {/* Experience */}
                {extractedData.experience && extractedData.experience.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
                    <div className="space-y-2">
                      {extractedData.experience.map((exp: any, index: number) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-3">
                          <p className="font-medium">{exp.title}</p>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isComplete && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">Profile Setup Complete!</span>
                </div>
                <p className="text-sm text-green-700 mb-4">
                  Your profile has been created successfully. You can now access your dashboard and start working on tasks.
                </p>
                <button
                  onClick={goToDashboard}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Complete Profile</p>
                <p className="text-sm text-gray-600">Chat with our AI to set up your profile</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Get Matched</p>
                <p className="text-sm text-gray-600">Our algorithm matches you with relevant tasks</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Start Earning</p>
                <p className="text-sm text-gray-600">Complete tasks and build your income</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
