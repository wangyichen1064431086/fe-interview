// 双 for 循环
function multiTable(num) {
    for (let i = 1; i<=num; i++) {
        let str = ''
        for (let j=1; j<=i; j++) {
            str+= `${i}*${j}=${i*j} `
        }
        console.log(str)
    }
    
}
multiTable(9)

// 递归
function multiTable(num) {
    const multiTableOneline = (i) => {
        if(i > num) {
            return
        }
        let str = ''
        for (let j=1; j<=i; j++) {
            str+= `${i}*${j}=${i*j} `
        }
        console.log(str)
        multiTableOneline(i+1)
    }
    
    multiTableOneline(1) 
}
multiTable(9)

//更简洁的递归
function multiTable(num) {
    if(num === 1) {
        console.log('1*1=1')
    } else {
        multiTable(num-1)
        let str = ''
        for (let j=1; j<=num; j++) {
            str+= `${num}*${j}=${j*num} `
        }
        console.log(str)
    }
}
multiTable(9)

//递归实现倒序九九乘法表
function multiTable(num) {
    const multiTableOneline = (i) => {
        if(i > num) {
            return
        }
        multiTableOneline(i+1)
        let str = ''
        for (let j=1; j<=i; j++) {
            str+= `${i}*${j}=${i*j} `
        }
        console.log(str)
    }
    
    multiTableOneline(1) 
}
multiTable(9)

// 更简洁的倒序递归
function multiTable(num) {
    if(num === 1) {
        console.log('1*1=1')
    } else {
        let str = ''
        for (let j=1; j<=num; j++) {
            str+= `${num}*${j}=${j*num} `
        }
        console.log(str)
        multiTable(num-1)
    }
}
multiTable(9)