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
    },

    DataParaBancoFeriado: function(dt)
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
    },

    DataParaImpressao: function(mes, ano)
    {
        if(!mes)
        {
            return null;
        }

        switch(mes){
            case 'Janeiro':
                mesSelecionado = '01';
                break;
            case 'Fevereiro':
                mesSelecionado = '02';
                break;
            case 'Março':
                mesSelecionado = '03';
                break;
            case 'Abril':
                mesSelecionado = '04';
                break;
            case 'Maio':
                mesSelecionado = '05';
                break;
            case 'Junho':
                mesSelecionado = '06';
                break;
            case 'Julho':
                mesSelecionado = '07';
                break;
            case 'Agosto':
                mesSelecionado = '08';
                break;
            case 'Setembro':
                mesSelecionado = '09';
                break;
            case 'Outubro':
                mesSelecionado = '10';
                break;
            case 'Novembro':
                mesSelecionado = '11';
                break;
            case 'Dezembro':
                mesSelecionado = '12';
                break;
           }

        const data = (ano +  "/" + mesSelecionado);

        return data;
    }
};