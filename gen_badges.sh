#!/bin/bash
for lint in "lint_js"
do
    report=$lint"_report.txt"
    NBERR=$(grep -e "error" $report | wc -l)
    NBWARN=$(grep -e "warning" $report | wc -l)
    color="green"
    if [[ $NBERR > 0 ]]
    then
        color="red"
    else if [[ $NBWARN > 0 ]]
         then
             color="orange"
         fi
    fi
    anybadge -o -l ${lint:5} -v "$NBERR $NBWARN" -c "$color" -f $lint".svg"
done
