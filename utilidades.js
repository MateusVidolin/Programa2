module.exports = {
    fmDate: function(dt)
    {
        let dia = '';
        let mes = '';
         
        dia = '' + dt.getDate();
        if(dia.length == 1)
        {
            dia = '0' + dia;
        }
    
        mes = '' + (dt.getMonth() + 1); 
        if(mes.length == 1)
        {
            mes = '0' + mes;
        }
    
        return dt.getFullYear() + "-" + mes + "-" + dia;
    },

    DataParaBanco: function(dt)
    {
        if(!dt)
        {
            return null;
        }
        const ano = dt.substr(0, 4);
        const mes = dt.substr(5, 2);
        const dia = dt.substr(8, 2);

        const data = new Date(mes + "/" + dia + "/" + ano);

        return data;
    }
};