function MedicationItem({ medication, onTakeNow }) {
  const { id, medication_name, dosage, scheduled_time, status } = medication;
  
  const getStatusConfig = (status) => {
    switch(status) {
      case 'taken':
        return {
          bgColor: 'bg-green-50 border-green-200',
          dotColor: 'bg-green-500',
          icon: <Check className="w-6 h-6 text-green-600" />,
          iconBg: 'bg-green-100',
          showButton: false
        };
      case 'missed':
        return {
          bgColor: 'bg-red-50 border-red-200',
          dotColor: 'bg-red-500',
          icon: <X className="w-6 h-6 text-red-600" />,
          iconBg: 'bg-red-100',
          buttonColor: 'bg-red-500 hover:bg-red-600',
          buttonText: 'Take Now (Late)',
          showButton: true
        };
      case 'late':
        return {
          bgColor: 'bg-yellow-50 border-yellow-200',
          dotColor: 'bg-yellow-500',
          icon: <AlertCircle className="w-6 h-6 text-yellow-600" />,
          iconBg: 'bg-yellow-100',
          showButton: false
        };
      default:
        return {
          bgColor: 'bg-white border-gray-100',
          dotColor: 'bg-green-500',
          icon: null,
          showButton: true,
          buttonColor: 'bg-green-500 hover:bg-green-600',
          buttonText: 'Take Now'
        };
    }
  };

  const config = getStatusConfig(status);
  const time = new Date(scheduled_time).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${config.bgColor} hover:border-gray-300 transition-all`}>
      <div className="flex items-center gap-4">
        <div className={`w-4 h-4 rounded-full flex-shrink-0 ${config.dotColor}`}></div>
        <div>
          <p className="font-semibold text-gray-900 text-base">{medication_name}</p>
          <p className="text-sm text-gray-500 mt-0.5">{dosage} - {time}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {config.icon && (
          <div className={`w-10 h-10 ${config.iconBg} rounded-full flex items-center justify-center`}>
            {config.icon}
          </div>
        )}
        {config.showButton && (
          <button
            onClick={() => onTakeNow(id)}
            className={`${config.buttonColor} text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm`}
          >
            {config.buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
