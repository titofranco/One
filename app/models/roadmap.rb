class Roadmap < ActiveRecord::Base

  validates_presence_of :initial_point, :end_point
  validate :latitud_longitud

  def latitud_longitud(initial_point)
    puts"fdsfdsfdsfdsfdsfdsfdsfds #{initial_point}"
    errors.add(:initial_point,'No debe ser nulo') if initial_point.nil?
  end
end

