import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

type ExamList = Exam & { lesson: { subject: Subject, class: Class, teacher: Teacher } };

const LessonListPage = async ({ searchParams }: {
    searchParams: { [key: string]: string | undefined };
}) => {

    const { sessionClaims, userId } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    const columns = [
        {
            header: "Subject Name",
            accessor: "name",
        },
        {
            header: "Class",
            accessor: "class",
        },
        {
            header: "Teacher",
            accessor: "teacher",
            className: "hidden md:table-cell",
        },
        {
            header: "Date",
            accessor: "date",
            className: "hidden md:table-cell",
        },
        ...(role === "admin" || role === "teacher"
            ? [
                {
                    header: "Actions",
                    accessor: "action",
                },
            ]
            : []),
    ];

    const renderRow = (item: ExamList) => (
        <tr
            key={item?.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
            <td className="flex items-center gap-4 py-4">{item?.lesson?.subject?.name}</td>
            <td>{item?.lesson?.class?.name}</td>
            <td className="hidden md:table-cell">{item?.lesson?.teacher?.name + " " + item?.lesson?.teacher?.surname}</td>
            <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item?.startTime)}</td>
            <td>
                <div className="flex items-center gap-2">
                    {(role === "admin" || role === "teacher") && (
                        <>
                            <FormModal table="exam" type="update" data={item} />
                            <FormModal table="exam" type="delete" id={item.id} />
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    const { page, ...queryParams } = searchParams;

    const pageNumber = page ? parseInt(page) : 1;

    // url params condition
    const query: Prisma.ExamWhereInput = {};
    query.lesson = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "classId":
                        query.lesson.classId = parseInt(value)
                        break;
                    case "teacherId":
                        query.lesson.teacherId = value
                        break;
                    case "search":
                        query.lesson = {
                            subject: { name: { contains: value, mode: "insensitive" } }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // role conditions
    switch (role) {
        case "admin":
            break;
        case "teacher":
            query.lesson.teacherId = userId!;
            break;
        case "student":
            query.lesson.class = {
                students: {
                    some: {
                        id: userId!,
                    },
                },
            };
            break;
        case "parent":
            query.lesson.class = {
                students: {
                    some: {
                        parentId: userId!,
                    },
                },
            };
            break;

        default:
            break;
    }

    const [examsData, count] = await prisma.$transaction([
        prisma?.exam?.findMany({
            where: query,
            include: {
                lesson: {
                    select: {
                        subject: { select: { name: true } },
                        class: { select: { name: true } },
                        teacher: { select: { name: true, surname: true } }
                    }
                }
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (pageNumber - 1)
        }),

        prisma?.exam?.count({ where: query })
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="filter" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="filter" width={14} height={14} />
                        </button>
                        {(role === "admin" || role === "teacher") && (
                            <FormModal table="exam" type="create" />
                        )}
                        {/* {(role === "admin" || role === "teacher") && (
                            <FormContainer table="exam" type="create" />
                        )} */}
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={columns} renderRow={renderRow} data={examsData} />
            {/* pagination */}
            <Pagination page={pageNumber} count={count} />
        </div>
    )
}

export default LessonListPage;