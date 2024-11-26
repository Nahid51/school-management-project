const getLatestSunday = (): Date => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceSunday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const latestSunday = today;
    latestSunday.setDate(today.getDate() - daysSinceSunday);
    return latestSunday;
};

export const adjustScheduleToCurrentWeek = (
    lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
    const latestSunday = getLatestSunday();

    return lessons.map((lesson) => {
        const lessonDayOfWeek = lesson.start.getDay();

        const daysFromSunday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

        const adjustedStartDate = new Date(latestSunday);

        adjustedStartDate.setDate(latestSunday.getDate() + daysFromSunday);
        adjustedStartDate.setHours(
            lesson.start.getHours(),
            lesson.start.getMinutes(),
            lesson.start.getSeconds()
        );
        const adjustedEndDate = new Date(adjustedStartDate);
        adjustedEndDate.setHours(
            lesson.end.getHours(),
            lesson.end.getMinutes(),
            lesson.end.getSeconds()
        );

        return {
            title: lesson.title,
            start: adjustedStartDate,
            end: adjustedEndDate,
        };
    });
};