// pages/index.js

import { useState } from 'react';

export default function Home() {
    const [attendedClasses, setAttendedClasses] = useState(0);
    const [totalClasses, setTotalClasses] = useState(0);
    const [result, setResult] = useState(null);

    function classesNeededForTargetAttendance(attendedClasses, totalClasses, targetPercentage = 75, classesPerDay = 6) {
        // Calculate how many more classes and days are needed to reach the target attendance percentage.
        let requiredAttendance = targetPercentage / 100;
        let additionalClassesNeeded = 0;
    
        while (true) {
            let projectedTotalClasses = totalClasses + additionalClassesNeeded;
            let requiredClasses = Math.ceil(projectedTotalClasses * requiredAttendance);
            if ((attendedClasses + additionalClassesNeeded) >= requiredClasses) {
                break;
            }
            additionalClassesNeeded++;
        }
    
        let additionalDaysNeeded = Math.ceil(additionalClassesNeeded / classesPerDay);
        return [additionalClassesNeeded, additionalDaysNeeded];
    }
    
    function daysCanSkip(attendedClasses, totalClasses, classesPerDay = 6, targetPercentage = 75) {
        // Calculate how many more days the student can afford to skip.
        let daysSkipped = 0;
        while (calculateAttendance(attendedClasses, totalClasses + daysSkipped * classesPerDay) >= targetPercentage) {
            daysSkipped++;
        }
        return daysSkipped - 1; // Subtract 1 because the loop exits after crossing the threshold
    }
    
    function calculateAttendance(attendedClasses, totalClasses) {
        // Helper function to calculate attendance percentage
        return (attendedClasses / totalClasses) * 100;
    }
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        const attendedClasses=parseInt(event.target.attended.value);
        const totalClasses=parseInt(event.target.total.value);
        if(attendedClasses===0 && totalClasses===0)
        return;

        const attendancePercentage=calculateAttendance(attendedClasses,totalClasses);
        const [additionalClassesNeeded,additionalDaysNeeded] = classesNeededForTargetAttendance(attendedClasses,totalClasses);
        const canSkipDays = daysCanSkip(attendedClasses,totalClasses)

        /*console.log(attendancePercentage)
        console.log(additionalClassesNeeded)
        console.log(additionalDaysNeeded)
        console.log(canSkipDays)*/

        const data={
            attendance:attendancePercentage.toFixed(2),
            classesNeeded:additionalClassesNeeded,
            daysNeeded:additionalDaysNeeded,
            daysToSkip:canSkipDays,

        }
        setResult(data);
    };

    return (
        <div className="bg-gradient-to-b from-white to-gray-500 h-screen text-center items-center flex flex-col align-center">
            <h1 className="text-red-700 text-6xl">Attendance Calculator</h1>
            <form onSubmit={handleSubmit}>
            <label htmlFor="number-input1" className="block mt-2 ml-2 mb-2 text-sm font-medium text-black dark:text-black">Enter number of classes attended:</label>
            <input name='attended' value={attendedClasses} onChange={(e) => setAttendedClasses(e.target.value)} type="number" id="number-input1" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 ml-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Attended Classes" required/>
            <label htmlFor="number-input2" className="block mt-2 ml-2 mb-2 text-sm font-medium text-black dark:text-black">Enter total number of classes:</label>
            <input name='total' value={totalClasses} onChange={(e) => setTotalClasses(e.target.value)} type="number" id="number-input2" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 ml-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Total Classes" required/>
                <button className="mt-2 ml-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="submit">Calculate</button>
                </form>
            {result && (
                <div className="block mb-2 text-sm font-large text-black text-2xl dark:text-black">
                    <p>Your attendance is: {result.attendance}%</p>
                    <p>You need to attend {result.classesNeeded} more classes ({result.daysNeeded} days) to reach 75% attendance.</p>
                    <p>{result.daysToSkip > 0 ? `You can afford to skip ${result.daysToSkip} more days` : "You cannot afford to skip any days"} while maintaining your attendance above 75%.</p>
                </div>
            )}
        </div>
    );
}
