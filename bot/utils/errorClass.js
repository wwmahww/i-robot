module.exports = class _error {
        
    
    constructor(code, addres='', text='error', action='none') {
        
        this.code = code
        this.addres = addres;
        this.msg = text;
        this.action = action;
    }
}