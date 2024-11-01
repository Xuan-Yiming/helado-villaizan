"use client"
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es'; // Import Spanish locale

import { useState } from 'react';
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

import ConfirmationModal from "../confirmation-modal";

import { load_programmed_posts } from "@/app/lib/database";
import { calendarEvent } from "@/app/lib/types";

import './calendar.css'; // Import the custom CSS

export default function Calendar() {
    const [events, setEvents] = useState<calendarEvent[]>();
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
            router.push(`/pages/publicaciones/crear?postTime=${startStr}`);
        }
        setIsModalOpen(false);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    useEffect (() => {
        const fetchEvents = async () => {
            try {
                const data = await load_programmed_posts();
                // //console.log('Programmed posts:', data);
                const _events: calendarEvent[] = data.map((post): calendarEvent | undefined => {
                    const start = post.post_time ? new Date(post.post_time).toISOString().slice(0, 16) : '';
                    const end = start ? new Date(new Date(start).getTime() + 60 * 60 * 1000).toISOString().slice(0, 16) : '';
                    // //console.log('Start:', start);
                    // //console.log('End:', end);
                    return {
                        id: post.id,
                        title: post.content || '',
                        start: start || '',
                        end: end,
                        url: `/pages/publicaciones/crear?id=${post.id}`,
                        allDay: false,
                        overlap: false,
                    }
                }).filter(Boolean) as calendarEvent[];
                setEvents(_events);
            } catch (error) {
                console.error('Error fetching programmed posts:', error);
            }
        };
        fetchEvents();
    }, []);
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