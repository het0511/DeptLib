import React from 'react';
import { format, isBefore } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import { Transaction } from '../types';

interface DueDateReminderProps {
  transactions: Transaction[];
}

const DueDateReminder: React.FC<DueDateReminderProps> = ({ transactions }) => {
  const borrowedBooks = transactions.filter(
    (t) => t.type === 'BORROW' && t.status === 'ACTIVE'
  );

  if (borrowedBooks.length === 0) return null;

  const today = new Date();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <AlertCircle className="h-5 w-5 text-indigo-600 mr-2" />
        Book Return Reminders
      </h2>
      <div className="space-y-4">
        {borrowedBooks.map((transaction) => {
          const returnDate = new Date(transaction.returnDate!);
          const isOverdue = isBefore(returnDate, today);

          return (
            <div
              key={transaction.id}
              className={`p-4 rounded-lg ${
                isOverdue ? 'bg-red-50' : 'bg-yellow-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`font-medium ${
                      isOverdue ? 'text-red-800' : 'text-yellow-800'
                    }`}
                  >
                    {isOverdue ? 'Overdue!' : 'Due Soon'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Return by: {format(returnDate, 'MMMM dd, yyyy')}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isOverdue
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {isOverdue
                    ? `${Math.abs(
                        Math.ceil(
                          (today.getTime() - returnDate.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      )} days overdue`
                    : `${Math.ceil(
                        (returnDate.getTime() - today.getTime()) /
                          (1000 * 60 * 60 * 24)
                      )} days left`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DueDateReminder;