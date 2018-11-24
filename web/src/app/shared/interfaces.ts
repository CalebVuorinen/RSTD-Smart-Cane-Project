import { ModuleWithProviders } from '@angular/core';
import { Routes } from '@angular/router';
import {ILocation} from "selenium-webdriver";

export interface ICustomer {
    _id?: string;
    firstName: string;
    lastName: string;
    gender: string;
    address: string;
    city: string;
    state: IState;
    orders?: IOrder[];
    orderTotal?: number;
    latitude?: number;
    longitude?: number;
    locations?: ILocations[];
    macAddress?: string;
}

export interface ILocations {
    latitude?: number;
    longitude?: number;
    date?: string;
    time?: string;
}

export interface IState {
    abbreviation: string;
    name: string;
    _id?: string;
}

export interface IOrder {
    productName: string;
    itemCost: number;
}

export interface IOrderItem {
    id: number;
    productName: string;
    itemCost: number;
}

export interface IPagedResults<T> {
    totalRecords: number;
    results: T;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface IApiResponse {
    status: boolean;
    error?: string;
}
