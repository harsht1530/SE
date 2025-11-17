import React, { useState, useEffect } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import '../index.css'


export const TrendsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reportLoaded, setReportLoaded] = useState(false);

    // Event handlers for better UX
    const eventHandlers = new Map([
        ['loaded', function () { 
            console.log('Report loaded');
            setReportLoaded(true);
            setIsLoading(false);
        }],
        ['rendered', function () { 
            console.log('Report rendered');
            setIsLoading(false);
        }],
        ['error', function (event) { 
            console.error('Power BI Error:', event.detail);
            setError(event.detail);
            setIsLoading(false);
        }],
        ['visualClicked', () => console.log('Visual clicked')],
        ['pageChanged', (event) => console.log('Page changed:', event)],
    ]);

    const embedConfig = {
        type: 'report',
        id: '5943e41c-12ab-41e5-96f4-57d68c498f94',
        embedUrl: import.meta.env.VITE_EMBEDDED_URL,
        accessToken: import.meta.env.VITE_POWERBI_TOKEN,
        tokenType: models.TokenType.Embed,
        settings: {
            panes: {
                filters: {
                    expanded: false,
                    visible: true // Keep visible for better UX
                },
                pageNavigation: {
                    visible: true
                }
            },
            background: models.BackgroundType.Transparent,
            layoutType: models.LayoutType.Custom,
            customLayout: {
                displayOption: models.DisplayOption.FitToPage
            }
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Report</h3>
                        <p className="text-gray-600 mb-4">Unable to load the Power BI report. Please try again.</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
                                <p className="text-sm text-gray-500">Real-time insights and trends</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            {reportLoaded && (
                                <div className="flex items-center space-x-2 text-green-600">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium">Live</span>
                                </div>
                            )}
                            <button 
                                onClick={() => window.location.reload()}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Refresh"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Loading Overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading dashboard...</p>
                            </div>
                        </div>
                    )}

                    {/* Power BI Report Container */}
                    <div className="relative">
                        <PowerBIEmbed
                            id="reportContainer"
                            embedConfig={embedConfig}
                            eventHandlers={eventHandlers}
                            cssClassName="powerbi-report-container"
                            getEmbeddedComponent={(embeddedReport) => {
                                window.report = embeddedReport;
                            }}
                        />
                    </div>
                </div>

                {/* Additional Info Cards */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Trends Analysis</h3>
                                <p className="text-gray-600">Interactive data visualization</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Real-time Data</h3>
                                <p className="text-gray-600">Live updates and insights</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Custom Filters</h3>
                                <p className="text-gray-600">Tailored data views</p>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};