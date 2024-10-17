"use client"
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es'; // Import Spanish locale

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import ConfirmationModal from "../confirmation-modal";

import './calendar.css'; // Import the custom CSS

const initialEvents = [
    { title: 'Event 1', date: '2024-10-30', url: '/pages/publicaciones/crear?type=nuevo/id=1' },
    { title: 'Event 2', date: '2024-10-20', url: '/pages/publicaciones/crear?type=nuevo/id=2' },
    // Add more events as needed
];

export default function Calendar() {
    const [events, setEvents] = useState(initialEvents);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState<{ startStr: string; endStr: string; allDay: boolean } | null>(null);
    const router = useRouter();

    const handleDateSelect = (selectInfo: { startStr: string; endStr: string; allDay: boolean }) => {
        setSelectedInfo(selectInfo);
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        if (selectedInfo) {
            const { startStr, endStr, allDay } = selectedInfo;
            const allDayParam = allDay ? 'true' : 'false';
            router.push(`/pages/publicaciones/crear?type=programado&start=${startStr}&end=${endStr}&allDay=${allDayParam}`);
        }
        setIsModalOpen(false);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };
    return (
        <>

            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }} // Set header toolbar options.
                locale={esLocale} // Set locale to Spanish
                height={"85vh"}
                selectable={true} // Enable date selection
                select={handleDateSelect} // Handle date selection
                validRange={{
                    start: new Date().toISOString().split('T')[0], // Limit calendar to dates starting from today
                }}
            />
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleClose}
                onConfirm={handleConfirm}
            />
        </>

    );
}