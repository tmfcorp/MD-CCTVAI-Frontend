import { message } from "antd";

export const showApiErrors = (errorResponse: any) => {
    if (errorResponse?.data && Array.isArray(errorResponse.data)) {
        errorResponse.data.forEach((err: any) => {
            let field = '';
            if (Array.isArray(err.loc)) {
                field = err.loc[1] || '';
            } else if (typeof err.loc === 'string') {
                field = err.loc.replace(/\('body',\s*'(.+)'\)/, '$1');
            }

            const msg = err.msg || 'Error';
            message.error(`${field}: ${msg}`);
        });
    } else {
        message.error(errorResponse.message || 'Unknown error');
    }
};