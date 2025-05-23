"use client"

import { setSidebarSelected } from "@/reduxs/menu.redux";
import { useAppDispatch } from "@/reduxs/store.redux";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

const TimeTrackingNoData = () => {
	const t = useTranslations();
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(setSidebarSelected('time-tracking'));
	} ,[]);
	return (
		<div className="container-fluid px-4 py-4 time-tracking-view d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
			<div className="text-center bg-light border rounded-4 shadow-sm p-5" style={{ maxWidth: '700px', width: '100%' }}>
				<div className="mb-4">
					<i className="bi bi-clock-history text-primary" style={{ fontSize: '3rem' }}></i>
				</div>
				<h4 className="fw-semibold mb-3 text-dark">{t('time_tracking.no_time_tracking_title')}</h4>
				<p className="text-muted mb-4">
				{t('time_tracking.no_time_tracking_message')} <br />
				{t('time_tracking.back_later_message')}
				</p>
			</div>
		</div>
	);
};
export default TimeTrackingNoData;