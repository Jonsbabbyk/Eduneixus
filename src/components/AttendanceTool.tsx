import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { UserCheck, UserX, Clock, FileText } from 'lucide-react';

const students = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Williams' },
  { id: 3, name: 'Charlie Brown' },
  { id: 4, name: 'Diana Miller' },
  { id: 5, name: 'Ethan Davis' },
];

const AttendanceTool = () => {
  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleExportReport = () => {
    console.log('Exporting attendance report for:', date);
    console.log('Attendance data:', attendance);
    alert('Attendance report exported! Check the console for details.');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-orange-600" />
            Attendance Tracker
          </h2>
          <div className="flex items-center gap-2">
            <label htmlFor="attendance-date" className="font-medium text-gray-700">Date:</label>
            <input
              type="date"
              id="attendance-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 border rounded-md"
            />
          </div>
        </div>
        <p className="text-gray-600 mb-6">Mark students as Present, Absent, or Tardy for the selected date.</p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      attendance[student.id] === 'Present' ? 'bg-green-100 text-green-800' :
                      attendance[student.id] === 'Absent' ? 'bg-red-100 text-red-800' :
                      attendance[student.id] === 'Tardy' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {attendance[student.id] || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleStatusChange(student.id, 'Present')} title="Mark Present">
                        <UserCheck className="w-5 h-5 text-green-600" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleStatusChange(student.id, 'Absent')} title="Mark Absent">
                        <UserX className="w-5 h-5 text-red-600" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleStatusChange(student.id, 'Tardy')} title="Mark Tardy">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end mt-6 space-x-4">
          <Button variant="outline" onClick={handleExportReport}>
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            Save Attendance
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceTool;