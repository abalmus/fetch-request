export const METHODS = [
    'GET',
    'HEAD',
    'PUT',
    'POST',
    'PATCH',
    'DELETE',
    'OPTIONS'
];

export const DEFAULT_OPTIONS = {
    'normalizeUrl': true,
    'format': 'default',
    'credentials': 'same-origin',
    'headers': {
        'X-Requested-With': 'XMLHttpRequest'
    }
};
