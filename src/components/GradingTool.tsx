// GradingTool.tsx

import React, { useState } from 'react';
import { CheckCircle, Upload, FileText, BarChart3, Download } from 'lucide-react';
import Card from './Card';
import Button from './Button';

function GradingTool() {
  const [gradingMode, setGradingMode] = useState('manual');
  const [manualAnswers, setManualAnswers] = useState('');
  const [rubric, setRubric] = useState('standard');
  const [gradedResults, setGradedResults] = useState<any>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [error, setError] = useState('');

  const rubricTypes = [
    { value: 'standard', label: 'Standard Grading (A-F)' },
    { value: 'points', label: 'Points-based (0-100)' },
    { value: 'competency', label: 'Competency-based' },
    { value: 'holistic', label: 'Holistic Rubric' }
  ];

  const handleGradeAssignments = async () => {
    if (gradingMode === 'manual' && !manualAnswers.trim()) {
      setError('Please enter some answers to grade.');
      return;
    }

    setError('');
    setIsGrading(true);
    setGradedResults(null);

    // Prepare the data to send to the backend
    const payload = {
      manual_answers: manualAnswers,
      rubric: rubric
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/grade-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with a ${response.status} error.`);
      }

      const data = await response.json();
      setGradedResults(data);
    } catch (err: any) {
      console.error('Error during AI grading:', err);
      setError(err.message || 'An error occurred while grading. Please try again.');
    } finally {
      setIsGrading(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradedResults),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF from server.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'graded_assignments.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setError('Could not export to PDF.');
    }
  };

  const handleExportJson = async () => {
    try {
      const json = JSON.stringify(gradedResults, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'graded_results.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting JSON:', err);
      setError('Could not export to JSON.');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">AI Grading Tool</h2>
          </div>

        {/* Grading Mode Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Grading Method</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setGradingMode('upload')}
              className={`p-4 border-2 rounded-lg transition-all ${
                gradingMode === 'upload' 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Upload className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold">Upload Files</div>
              <div className="text-sm text-gray-600">Upload scanned papers or digital submissions</div>
            </button>

            <button
              onClick={() => setGradingMode('manual')}
              className={`p-4 border-2 rounded-lg transition-all ${
                gradingMode === 'manual' 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold">Manual Input</div>
              <div className="text-sm text-gray-600">Type or paste answers and rubric</div>
            </button>
          </div>
        </div>

        {/* Upload Mode */}
        {gradingMode === 'upload' && (
          <div className="mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Assignment Files
              </h4>
              <p className="text-gray-600 mb-4">
                Drag and drop files or click to select. Supports PDF, DOC, and image files.
              </p>
              <Button>Choose Files</Button>
            </div>
          </div>
        )}

        {/* Manual Mode */}
        {gradingMode === 'manual' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer Key or Student Responses
            </label>
            <textarea
              value={manualAnswers}
              onChange={(e) => setManualAnswers(e.target.value)}
              placeholder="Paste the answer key or student responses here..."
              rows={8}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Rubric Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grading Rubric
          </label>
          <select
            value={rubric}
            onChange={(e) => setRubric(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {rubricTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <Button 
          onClick={handleGradeAssignments}
          className="w-full"
          disabled={isGrading || (gradingMode === 'manual' && !manualAnswers.trim())}
        >
          {isGrading ? 'Grading in Progress...' : 'Start AI Grading'}
        </Button>
      </Card>

      {/* Grading Results */}
      {gradedResults && (
        <div className="space-y-6">
          {/* Results Overview */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Grading Complete!</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{gradedResults.totalSubmissions}</div>
                <div className="text-sm text-gray-600">Total Submissions</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{gradedResults.avgScore}%</div>
                <div className="text-sm text-gray-600">Class Average</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{gradedResults.gradedCount}</div>
                <div className="text-sm text-gray-600">Graded</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{gradedResults.timeToGrade}</div>
                <div className="text-sm text-gray-600">Time Saved</div>
              </div>
            </div>
          </Card>

          {/* Grade Distribution */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4">Grade Distribution</h4>
            <div className="space-y-3">
              {Object.entries(gradedResults.distribution).map(([grade, count]) => (
                <div key={grade} className="flex items-center justify-between">
                  <span className="font-medium">{grade}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count as number / gradedResults.totalSubmissions) * 100}%` }}
                      />
                  </div>
                    {/* The fix is here: type asserting 'count' to a number for display */}
                    <span className="text-sm text-gray-600 w-8">{count as number}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Individual Results */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Student Results</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExportPdf()}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
                <Button size="sm">Send Feedback</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Student Name</th>
                    <th className="text-left py-2">Score</th>
                    <th className="text-left py-2">Grade</th>
                    <th className="text-left py-2">AI Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {gradedResults.studentResults.map((student: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{student.name}</td>
                      <td className="py-3">{student.score}%</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          student.score >= 90 ? 'bg-green-100 text-green-800' :
                          student.score >= 80 ? 'bg-blue-100 text-blue-800' :
                          student.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          student.score >= 60 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {student.score >= 90 ? 'A' :
                           student.score >= 80 ? 'B' :
                           student.score >= 70 ? 'C' :
                           student.score >= 60 ? 'D' : 'F'}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600 max-w-xs truncate">{student.feedback}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default GradingTool;