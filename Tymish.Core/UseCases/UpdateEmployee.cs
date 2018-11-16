using Tymish.Core.Entities;
using Tymish.Core.Interfaces;

namespace Tymish.Core.UseCases
{
    public interface IUpdateEmployee : IUseCase<Employee, bool> { }

    public class UpdateEmployee : BaseUseCase, IUpdateEmployee
    {
        public UpdateEmployee(Employee employee,
            IRepository repository) : base(repository) { }

        public bool Execute(Employee employee)
        {
            _repository.Update<Employee>(employee);
            return true;
        }
    }
}