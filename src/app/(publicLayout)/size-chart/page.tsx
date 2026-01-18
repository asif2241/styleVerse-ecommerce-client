/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- DATA STRUCTURES ---
const womenShoeData = [
    { unit: "US & Canada", sizes: ["4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"] },
    { unit: "UK", sizes: ["2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"] },
    { unit: "Europe", sizes: ["35", "35", "35-36", "36", "36-37", "37", "37-38", "38", "38-39", "39", "39-40", "40", "40-41", "41", "41-42", "42", "42-43"] },
    { type: "inch", unit: "Inches", sizes: ["8.2", "8.3", "8.5", "8.8", "8.9", "9.1", "9.3", "9.4", "9.5", "9.7", "9.9", "10", "10.2", "10.3", "10.5", "10.7", "10.9"] },
    { type: "cm", unit: "Centimeters", sizes: ["20.8", "21.3", "21.6", "22.2", "22.5", "23", "23.5", "23.8", "24.1", "24.6", "25.1", "25.4", "25.9", "26.2", "26.7", "27.1", "27.6"] },
];

const menShoeData = [
    { unit: "US & Canada", sizes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13", "14", "15", "16"] },
    { unit: "UK", sizes: ["5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12.5", "13.5", "14.5", "15.5"] },
    { unit: "Europe", sizes: ["39", "39", "40", "40-41", "41", "41-42", "42", "42-43", "43", "43-44", "44", "44-45", "45", "46", "47", "48", "49"] },
    { type: "inch", unit: "Inches", sizes: ["9.3", "9.5", "9.6", "9.8", "9.9", "10.1", "10.3", "10.4", "10.6", "10.8", "10.9", "11.1", "11.3", "11.6", "11.9", "12.2", "12.5"] },
    { type: "cm", unit: "Centimeters", sizes: ["23.5", "24.1", "24.4", "24.8", "25.4", "25.7", "26", "26.7", "27", "27.3", "27.9", "28.3", "28.6", "29.4", "30.2", "31", "31.8"] },
];

const panjabiData = {
    regular: [
        { size: "XS (EXTRA SMALL)", chest: 40, height: 38, sleeve: 23.5 },
        { size: "S (SMALL)", chest: 42, height: 40, sleeve: 24.0 },
        { size: "M (MEDIUM)", chest: 44, height: 42, sleeve: 24.5 },
        { size: "L (LARGE)", chest: 46, height: 44, sleeve: 25.0 },
        { size: "XL (EXTRA LARGE)", chest: 48, height: 46, sleeve: 25.5 },
        { size: "XXL (DOUBLE EXTRA LARGE)", chest: 50, height: 46, sleeve: 25.5 },
    ],
    slim: [
        { size: "M (MEDIUM)", chest: 40, height: 40, sleeve: 24.0 },
        { size: "L (LARGE)", chest: 42, height: 42, sleeve: 24.5 },
        { size: "XL (EXTRA LARGE)", chest: 44, height: 42, sleeve: 25.0 },
        { size: "XXL (DOUBLE EXTRA LARGE)", chest: 46, height: 44, sleeve: 25.0 },
    ]
};

const shirtData = [
    { size: "S", length: 27.5, chest: 41, sleeve: 8.5 },
    { size: "M", length: 28.5, chest: 43, sleeve: 9.0 },
    { size: "L", length: 29.5, chest: 45, sleeve: 9.5 },
    { size: "XL", length: 30.5, chest: 46, sleeve: 10.0 },
    { size: "2XL", length: 31.0, chest: 47, sleeve: 10.0 },
];

const tShirtData = [
    { size: "S", chest: 38.5, length: 27.5 },
    { size: "M", chest: 39.5, length: 28.25 },
    { size: "L", chest: 40.0, length: 29.0 },
    { size: "XL", chest: 40.75, length: 29.75 },
    { size: "2XL", chest: 41.0, length: 30.5 },
    { size: "3XL", chest: 42.25, length: 31.25 },
];

export default function SizeGuidePage() {
    const [unit, setUnit] = useState<"inch" | "cm">("inch");

    const convert = (val: number) => (unit === "cm" ? (val * 2.54).toFixed(1) : val);

    return (
        <div className="max-w-7xl mx-auto py-16 px-6 space-y-24 bg-white">
            {/* --- PAGE HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-10">
                <div>
                    <h1 className="text-5xl font-serif font-medium text-zinc-900">Size Charts</h1>
                    <p className="text-zinc-500 text-lg mt-2 font-light italic">Measure yourself to find the perfect fit.</p>
                </div>
                <Tabs value={unit} onValueChange={(v: any) => setUnit(v as any)}>
                    <TabsList className="h-12 bg-zinc-100 p-1">
                        <TabsTrigger value="inch" className="px-8 font-bold">INCHES</TabsTrigger>
                        <TabsTrigger value="cm" className="px-8 font-bold">CM</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* --- FOOTWEAR SECTION --- */}
            <div className="space-y-16">
                <ShoeConversionTable title="Women's Shoe Size Conversion" data={womenShoeData} unit={unit} />
                <ShoeConversionTable title="Men's Shoe Size Conversion" data={menShoeData} unit={unit} />
            </div>

            {/* --- PANJABI SECTION --- */}
            <div className="space-y-12">
                <h2 className="text-3xl font-serif text-center uppercase tracking-widest border-b pb-4">Panjabi Size Guide</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold uppercase text-zinc-700">Regular Fit (inch)</h3>
                        <MeasurementTable data={panjabiData.regular} unit={unit} convert={convert} columns={["Size", "(A) Chest", "(B) Height", "(C) Sleeve"]} />
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold uppercase text-zinc-700">Slim Fit (inch)</h3>
                        <MeasurementTable data={panjabiData.slim} unit={unit} convert={convert} columns={["Size", "(A) Chest", "(B) Height", "(C) Sleeve"]} />
                    </div>
                </div>
            </div>

            {/* --- SHIRT & T-SHIRT SECTION --- */}
            <div className="space-y-12">
                <h2 className="text-3xl font-serif text-center uppercase tracking-widest border-b pb-4">Men's Casual Wear</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold uppercase text-zinc-700">Half Sleeve Shirt</h3>
                        <MeasurementTable data={shirtData} unit={unit} convert={convert} columns={["Size", "Length", "Chest", "Sleeve Length"]} />
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold uppercase text-zinc-700">Essential T-Shirt</h3>
                        <MeasurementTable data={tShirtData} unit={unit} convert={convert} columns={["Size", "Chest", "Length"]} />
                    </div>
                </div>
            </div>

            {/* --- MEASUREMENT INSTRUCTIONS --- */}
            <div className="bg-zinc-950 text-white p-10 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-bold italic">How to measure?</h3>
                    <ul className="space-y-2 text-zinc-400 text-sm">
                        <li><strong className="text-white">Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
                        <li><strong className="text-white">Length:</strong> Measure from the highest point of the shoulder down to the hem.</li>
                        <li><strong className="text-white">Sleeve:</strong> Measure from the shoulder bone down to the wrist or desired length.</li>
                    </ul>
                </div>
                <div className="w-full md:w-1/3 border border-zinc-800 p-4 rounded-lg bg-zinc-900/50 text-center">
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-2">Pro Tip</p>
                    <p className="text-sm italic">"If you are between two sizes, we always recommend going for the larger size for a relaxed, comfortable fit."</p>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENT: SHOE TABLE ---
function ShoeConversionTable({ title, data, unit }: { title: string, data: any[], unit: string }) {
    return (
        <section className="space-y-6">
            <div className="flex justify-between items-end">
                <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
                {/* <span className="text-xs font-bold underline cursor-pointer hover:text-zinc-500">SHOP CATEGORY</span> */}
            </div>
            <div className="rounded-lg border border-zinc-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-black">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="text-white font-bold h-10 w-[160px]">Unit</TableHead>
                                <TableHead colSpan={17} className="text-white font-bold text-center border-l border-white/10 h-10">
                                    Conversion Sizes
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.filter(row => !row.type || row.type === unit).map((row, idx) => (
                                <TableRow key={idx} className="hover:bg-zinc-50/50">
                                    <TableCell className="font-bold text-zinc-900 border-r bg-zinc-50/50">{row.unit}</TableCell>
                                    {row.sizes.map((val: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, i: React.Key | null | undefined) => (
                                        <TableCell key={i} className="text-center min-w-[55px] text-zinc-600 border-r last:border-r-0 text-xs">
                                            {val}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    );
}

// --- SUB-COMPONENT: MEASUREMENT TABLE ---
function MeasurementTable({ data, unit, convert, columns }: any) {
    return (
        <div className="rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-zinc-100">
                    <TableRow className="border-b border-zinc-200">
                        {columns.map((col: string) => (
                            <TableHead key={col} className="text-zinc-900 font-bold text-center first:text-left py-4">{col.toUpperCase()}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row: any, i: number) => (
                        <TableRow key={i} className="hover:bg-zinc-50 transition-colors">
                            <TableCell className="font-bold text-zinc-800 py-4">{row.size}</TableCell>
                            {Object.entries(row).filter(([key]) => key !== 'size').map(([_, val]: any, index) => (
                                <TableCell key={index} className="text-center text-zinc-600 font-medium">
                                    {convert(val)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}