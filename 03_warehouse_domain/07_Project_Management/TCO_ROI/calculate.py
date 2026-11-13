"""Независимая проверка учебной модели: Python 3, только стандартная библиотека."""
import json,pathlib
def npv(cf,r):return sum(x/(1+r)**t for t,x in enumerate(cf))
def irr(cf):
    lo,hi=-.95,10.
    for _ in range(200):
        mid=(lo+hi)/2
        if npv(cf,mid)>0:lo=mid
        else:hi=mid
    return (lo+hi)/2
data=json.loads(pathlib.Path(__file__).with_name('finance_inputs.json').read_text(encoding='utf-8'))
for a in data['alternatives']:
    cf=[-sum(a['capex_items'])]+[(sum(a['benefit_items']) if t>=data['benefit_start'] else 0)-a['delta_opex'] for t in range(1,6)]
    r=data['rate'];pvpos=sum(max(v,0)/(1+r)**t for t,v in enumerate(cf));pvneg=-sum(min(v,0)/(1+r)**t for t,v in enumerate(cf))
    assert abs(npv(cf,irr(cf)))<.001
    assert abs((pvpos-pvneg)-npv(cf,r))<.001
    print(a['id'], 'CF',cf,'NPV',round(npv(cf,r),2),'IRR',round(irr(cf)*100,4),'PI',round(pvpos/pvneg,6))
