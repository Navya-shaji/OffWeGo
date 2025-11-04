export interface BuddyTravelDto {
id?: string;
title: string;
destination: string;
startDate: Date;
endDate: Date;
price: number;
maxPeople: number;
joinedUsers: string[];
description: string;
category: string;
status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED' | 'APPROVED';
vendorId: string;
isApproved:boolean
}