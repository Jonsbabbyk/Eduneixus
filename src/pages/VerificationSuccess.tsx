import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

function VerificationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <Card className="p-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Verified Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Congratulations! Your email address has been successfully verified. You can now log in to your account.
          </p>
          <Button onClick={() => navigate('/student-login')}> {/* Updated to the correct route */}
            Go to Login
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default VerificationSuccess;