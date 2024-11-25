import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceSunday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - daysSinceSunday);

    const resData = await prisma.attendance.findMany({
        where: {
            date: {
                gte: lastSunday
            }
        },
        select: {
            date: true,
            present: true
        }
    });

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu"];

    const attendanceMap: { [key: string]: { present: number; absent: number } } = {
        Sun: { present: 0, absent: 0 },
        Mon: { present: 0, absent: 0 },
        Tue: { present: 0, absent: 0 },
        Wed: { present: 0, absent: 0 },
        Thu: { present: 0, absent: 0 },
    };

    resData.forEach((item) => {
        const itemDate = new Date(item?.date);
        const dayOfWeek = itemDate.getDay();

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const dayDate = daysOfWeek[dayOfWeek - 1];

            if (item?.present) {
                attendanceMap[dayDate].present += 1;
            } else {
                attendanceMap[dayDate].absent += 1;
            }
        }
    });

    const date = daysOfWeek.map((day) => ({
        name: day,
        present: attendanceMap[day]?.present,
        absent: attendanceMap[day]?.absent
    }));

    console.log(daysSinceSunday)
    console.log(dayOfWeek)
    console.log(daysOfWeek)
    console.log(attendanceMap)
    console.log(date)

    return (
        <div className="bg-white rounded-lg p-4 h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">Attendance</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <AttendanceChart data={date} />
        </div>
    )
}

export default AttendanceChartContainer;